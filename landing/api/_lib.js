import { Pool } from "pg";
import { randomBytes } from "node:crypto";

/* Shared by all /api functions. Runs server-side only. */

let pool = null;
export function db() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}

export async function ensureSchema() {
  const p = db();
  await p.query(`
    CREATE TABLE IF NOT EXISTS waitlist_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      source TEXT NOT NULL DEFAULT 'landing',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await p.query(`
    CREATE INDEX IF NOT EXISTS waitlist_users_created_idx
    ON waitlist_users (created_at DESC);
  `);
  await p.query(`
    ALTER TABLE waitlist_users ADD COLUMN IF NOT EXISTS emailed_at TIMESTAMPTZ;
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS tester_keys (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'issued',
      issued_ip TEXT,
      claimed_email TEXT,
      issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      claimed_at TIMESTAMPTZ
    );
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS claimed_keys (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      claimed_by_email TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'test-keys',
      claimed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  // retire pre-rule duplicates: keep each email's earliest claim
  await p.query(`
    UPDATE tester_keys t SET status = 'duplicate'
    WHERE t.status = 'claimed' AND EXISTS (
      SELECT 1 FROM tester_keys o
      WHERE o.claimed_email = t.claimed_email
        AND o.status = 'claimed' AND o.id < t.id
    );
  `);
  // hard backstop: one claimed key per email, even under racing requests
  await p.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS tester_keys_one_claim_per_email
    ON tester_keys (claimed_email) WHERE status = 'claimed';
  `);
}

/* Sliding-window limits, keyed per bucket.
   The edge appends the real client IP to X-Forwarded-For, so only the LAST
   entry is trusted — leading entries are client-controlled and must never
   key a limiter (that would be a spoofable bypass).
   Note: serverless instances each hold their own window, so this is
   a per-instance guard — the DB constraints are the hard backstop. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 1000;
const hits = new Map();

function burst(key, maxN, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= maxN) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  return false;
}

export function ipOf(req) {
  const fwd = req.headers["x-forwarded-for"];
  const parts = (Array.isArray(fwd) ? fwd.join(",") : String(fwd || ""))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length > 0) return parts[parts.length - 1];
  return req.socket?.remoteAddress || "unknown";
}

export function throttled(bucket, req) {
  return burst(bucket + ":" + ipOf(req), RATE_LIMIT, RATE_WINDOW_MS);
}

/* 10 requests/minute per email (abuse of a single identity across IPs) */
export function emailThrottled(bucket, email) {
  return burst(bucket + ":email:" + email, 10, 60 * 1000);
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const KEY_RE = /^[A-Z0-9]{9}$/;
const KEY_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ0123456789";

export function makeInvite() {
  return "CH-" + randomBytes(4).toString("hex").toUpperCase().slice(0, 6);
}

export function makeTesterKey() {
  const bytes = randomBytes(9);
  let out = "";
  for (let i = 0; i < 9; i++) out += KEY_ALPHABET[bytes[i] % 32];
  return out;
}

export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.length) return JSON.parse(req.body);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export function send(res, status, obj) {
  res.status(status).json(obj);
}

export function method(req, res, want) {
  if (req.method !== want) {
    res.setHeader("Allow", want);
    send(res, 405, { error: "Method not allowed." });
    return false;
  }
  return true;
}
