import { db, ensureSchema, throttled, EMAIL_RE, makeInvite, readJson, send, method } from "./_lib.js";
import { sendWelcomeEmail } from "../lib/mailer.mjs";

export default async function handler(req, res) {
  if (!method(req, res, "POST")) return;
  try {
    if (throttled("waitlist", req)) {
      return send(res, 429, { error: "Too many requests — please wait a second and try again." });
    }
    let parsed;
    try {
      parsed = await readJson(req);
    } catch {
      return send(res, 400, { error: "Invalid request body." });
    }
    const email = String(parsed.email || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return send(res, 400, { error: "Enter a valid work email." });
    }
    await ensureSchema();
    const pool = db();

    const existing = await pool.query("SELECT invite_code FROM waitlist_users WHERE email = $1", [email]);
    if (existing.rowCount > 0) {
      const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM waitlist_users");
      return send(res, 200, { ok: true, invite: existing.rows[0].invite_code, position: rows[0].n, returning: true });
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
        if (e.code !== "23505") throw e;
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
  } catch (e) {
    console.error("waitlist error:", e.message);
    return send(res, 500, { error: "Service error — try again in a moment." });
  }
}
