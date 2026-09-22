import { db, ensureSchema, throttled, ipOf, makeTesterKey, send, method } from "../_lib.js";

export default async function handler(req, res) {
  if (!method(req, res, "POST")) return;
  try {
    if (throttled("keygen", req)) {
      return send(res, 429, { error: "Too many keys — please wait a second and try again." });
    }
    await ensureSchema();
    const pool = db();
    const ip = ipOf(req);
    const minted = await pool.query(
      "SELECT COUNT(*)::int AS n FROM tester_keys WHERE issued_ip = $1 AND issued_at > now() - interval '24 hours'",
      [ip]
    );
    if (minted.rows[0].n >= 30) {
      return send(res, 429, { error: "Daily key allowance used up — try again tomorrow." });
    }

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
        if (e.code !== "23505") throw e;
      }
    }
    if (!key) return send(res, 500, { error: "Could not mint a key — try again." });
    return send(res, 200, { ok: true, key });
  } catch (e) {
    console.error("keygen error:", e.message);
    return send(res, 500, { error: "Service error — try again in a moment." });
  }
}
