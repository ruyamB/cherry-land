import { db, ensureSchema, throttled, EMAIL_RE, KEY_RE, readJson, send, method } from "../_lib.js";

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
    await ensureSchema();
    const pool = db();

    const found = await pool.query("SELECT status FROM tester_keys WHERE key = $1", [key]);
    if (found.rowCount === 0) {
      return send(res, 404, { error: "Key not found — it may be mistyped." });
    }
    if (found.rows[0].status === "claimed") {
      return send(res, 409, { error: "This key is already claimed." });
    }
    await pool.query(
      "UPDATE tester_keys SET status = 'claimed', claimed_email = $2, claimed_at = now() WHERE key = $1",
      [key, email]
    );
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
