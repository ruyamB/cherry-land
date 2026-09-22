import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { pool, ensureSchema } from "./db.mjs";
import { sendWelcomeEmail } from "../lib/mailer.mjs";

const PORT = Number(process.env.PORT || 8787);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* 5 requests / second sliding window, per bucket + IP */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 1000;
const hits = new Map(); // bucket:ip -> number[]

function throttled(bucket, ip) {
  const k = bucket + ":" + ip;
  const now = Date.now();
  const arr = (hits.get(k) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (arr.length >= RATE_LIMIT) {
    hits.set(k, arr);
    return true;
  }
  arr.push(now);
  hits.set(k, arr);
  return false;
}

function readBody(req, limit = 10 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error("too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function makeInvite() {
  return "CH-" + randomBytes(4).toString("hex").toUpperCase().slice(0, 6);
}

/* 9-char tester key: exactly 32 unambiguous chars (no I, L, O, U) */
const KEY_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ0123456789";
const KEY_RE = /^[A-Z0-9]{9}$/;
function makeTesterKey() {
  const bytes = randomBytes(9);
  let out = "";
  for (let i = 0; i < 9; i++) out += KEY_ALPHABET[bytes[i] % 32];
  return out;
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/waitlist") {
      const ip = req.socket.remoteAddress || "unknown";
      if (throttled("waitlist", ip)) {
        return send(res, 429, { error: "Too many requests — please wait a second and try again." });
      }
      let parsed;
      try {
        parsed = JSON.parse(await readBody(req));
      } catch {
        return send(res, 400, { error: "Invalid request body." });
      }
      const email = String(parsed.email || "").trim().toLowerCase();
      if (!EMAIL_RE.test(email)) {
        return send(res, 400, { error: "Enter a valid work email." });
      }

      const existing = await pool.query(
        "SELECT invite_code FROM waitlist_users WHERE email = $1",
        [email]
      );
      if (existing.rowCount > 0) {
        const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM waitlist_users");
        return send(res, 200, {
          ok: true,
          invite: existing.rows[0].invite_code,
          position: rows[0].n,
          returning: true,
        });
      }

      let invite = null;
      for (let i = 0; i < 3 && !invite; i++) {
        const code = makeInvite();
        try {
          await pool.query(
            "INSERT INTO waitlist_users (email, invite_code, source) VALUES ($1, $2, 'landing')",
            [email, code]
          );
          invite = code;
        } catch (e) {
          if (e.code !== "23505") throw e; // retry only invite collisions
        }
      }
      if (!invite) return send(res, 500, { error: "Could not reserve a key — try again." });
      const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM waitlist_users");
      // thank-you mail: best-effort, never fails the signup
      const mailed = await sendWelcomeEmail({ to: email, invite, position: rows[0].n });
      if (mailed) {
        await pool.query("UPDATE waitlist_users SET emailed_at = now() WHERE email = $1", [email]);
      }
      return send(res, 200, { ok: true, invite, position: rows[0].n, returning: false });
    }

    if (req.method === "POST" && req.url === "/api/keys/generate") {
      const ip = req.socket.remoteAddress || "unknown";
      if (throttled("keygen", ip)) {
        return send(res, 429, { error: "Too many keys — please wait a second and try again." });
      }
      await readBody(req).catch(() => "");
      let key = null;
      for (let i = 0; i < 5 && !key; i++) {
        const code = makeTesterKey();
        try {
          await pool.query(
            "INSERT INTO tester_keys (key, status, issued_ip) VALUES ($1, 'issued', $2)",
            [code, ip]
          );
          key = code;
        } catch (e) {
          if (e.code !== "23505") throw e; // retry only key collisions
        }
      }
      if (!key) return send(res, 500, { error: "Could not mint a key — try again." });
      return send(res, 200, { ok: true, key });
    }

    if (req.method === "POST" && req.url === "/api/keys/claim") {
      const ip = req.socket.remoteAddress || "unknown";
      if (throttled("keyclaim", ip)) {
        return send(res, 429, { error: "Too many requests — please wait a second and try again." });
      }
      let parsed;
      try {
        parsed = JSON.parse(await readBody(req));
      } catch {
        return send(res, 400, { error: "Invalid request body." });
      }
      const key = String(parsed.key || "").trim().toUpperCase();
      const email = String(parsed.email || "").trim().toLowerCase();
      if (!KEY_RE.test(key)) {
        return send(res, 400, { error: "That key doesn't look right — 9 characters, check and retry." });
      }
      if (!EMAIL_RE.test(email)) {
        return send(res, 400, { error: "Enter a valid work email to claim this key." });
      }
      const owned = await pool.query(
        "SELECT key FROM tester_keys WHERE claimed_email = $1 AND status = 'claimed' LIMIT 1",
        [email]
      );
      if (owned.rowCount > 0) {
        return send(res, 409, {
          error: "This email already owns a key.",
          owned: true,
          key: owned.rows[0].key,
        });
      }
      const found = await pool.query("SELECT status FROM tester_keys WHERE key = $1", [key]);
      if (found.rowCount === 0) {
        return send(res, 404, { error: "Key not found — it may be mistyped." });
      }
      if (found.rows[0].status === "claimed") {
        return send(res, 409, { error: "This key is already claimed." });
      }
      try {
        await pool.query(
          "UPDATE tester_keys SET status = 'claimed', claimed_email = $2, claimed_at = now() WHERE key = $1",
          [key, email]
        );
      } catch (e) {
        if (e.code === "23505") {
          const retry = await pool.query(
            "SELECT key FROM tester_keys WHERE claimed_email = $1 AND status = 'claimed' LIMIT 1",
            [email]
          );
          return send(res, 409, {
            error: "This email already owns a key.",
            owned: true,
            key: retry.rowCount > 0 ? retry.rows[0].key : undefined,
          });
        }
        throw e;
      }
      await pool.query(
        "INSERT INTO claimed_keys (key, claimed_by_email, source) VALUES ($1, $2, 'test-keys') ON CONFLICT (key) DO NOTHING",
        [key, email]
      );
      return send(res, 200, { ok: true, key, email });
    }

    if (req.method === "GET" && req.url === "/api/health") {
      await pool.query("SELECT 1");
      return send(res, 200, { ok: true });
    }

    return send(res, 404, { error: "Not found." });
  } catch (e) {
    console.error("waitlist api error:", e.message);
    return send(res, 500, { error: "Service error — try again in a moment." });
  }
});

ensureSchema()
  .then(() => {
    server.listen(PORT, "127.0.0.1", () => {
      console.log(`waitlist api on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("db init failed:", e.message);
    process.exit(1);
  });
