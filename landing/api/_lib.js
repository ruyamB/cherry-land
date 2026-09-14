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
}

/* 5 requests / second sliding window, per bucket + IP.
   Note: serverless instances each hold their own window, so this is
   a per-instance guard — the DB uniqueness constraints are the hard backstop. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 1000;
const hits = new Map();

export function throttled(bucket, req) {
  const fwd = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(fwd) ? fwd[0] : String(fwd || "").split(",")[0] || req.socket?.remoteAddress || "unknown").trim();
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
