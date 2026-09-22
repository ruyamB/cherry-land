import { db, ensureSchema, throttled, emailThrottled, EMAIL_RE, KEY_RE, readJson, send, method } from "../_lib.js";

export default async function handler(req, res) {
  if (!method(req, res, "POST")) return;
  try {
    if (throttled("keyclaim", req)) {
      return send(res, 429, { error: "Too many requests — please wait a second and try again." });
    }
    let parsed;
    try {
      parsed = await readJson(req);
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
    if (emailThrottled("keyclaim", email)) {
      return send(res, 429, { error: "Too many requests for this email — please wait a minute and try again." });
    }
    await ensureSchema();
    const pool = db();

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
  } catch (e) {
    console.error("keyclaim error:", e.message);
    return send(res, 500, { error: "Service error — try again in a moment." });
  }
}
