import { Pool } from "pg";

/* Server-side only — never imported by client code. */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS waitlist_users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      source TEXT NOT NULL DEFAULT 'landing',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await pool.query(`
    CREATE INDEX IF NOT EXISTS waitlist_users_created_idx
    ON waitlist_users (created_at DESC);
  `);
  await pool.query(`
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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS claimed_keys (
      id SERIAL PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      claimed_by_email TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'test-keys',
      claimed_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}
