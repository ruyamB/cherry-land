import { db, throttled, send, method } from "./_lib.js";

export default async function handler(req, res) {
  if (!method(req, res, "GET")) return;
  try {
    if (throttled("health", req)) {
      return send(res, 429, { error: "Too many requests." });
    }
    await db().query("SELECT 1");
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { ok: false });
  }
}
