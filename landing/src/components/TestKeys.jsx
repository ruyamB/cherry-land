import { useRef, useState } from "react";
import { ArrowUpRight, Check, CopySimple, Keyhole, SealCheck } from "@phosphor-icons/react";
import RevealV from "./RevealV";
import Footer from "./Footer";

/* Client-side 5/sec guard mirrors the server buckets */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 1000;

function useRateGuard() {
  const attempts = useRef([]);
  return () => {
    const now = Date.now();
    attempts.current = attempts.current.filter((t) => now - t < RATE_WINDOW_MS);
    if (attempts.current.length >= RATE_LIMIT) return false;
    attempts.current.push(now);
    return true;
  };
}

/* /test-keys — mint one 9-char tester key per request, then claim it */
export default function TestKeys() {
  const allowGen = useRateGuard();
  const allowClaim = useRateGuard();
  const [key, setKey] = useState("");
  const [email, setEmail] = useState("");
  const [genState, setGenState] = useState("idle");
  const [claimState, setClaimState] = useState("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setError("");
    if (!allowGen()) {
      setError("Too many keys — please wait a second and try again.");
      return;
    }
    setGenState("loading");
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch("/api/keys/generate", { method: "POST", signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (res.status === 429 || !res.ok || !data.key) {
        setGenState("idle");
        setError(data.error || "Couldn't mint a key — try again in a moment.");
        return;
      }
      setKey(data.key);
      setClaimState("idle");
      setCopied(false);
      setGenState("idle");
    } catch {
      setGenState("idle");
      setError("Couldn't reach the key service — check your connection and try again.");
    }
  };

  const claim = async (e) => {
    e.preventDefault();
    setError("");
    if (!allowClaim()) {
      setError("Too many requests — please wait a second and try again.");
      return;
    }
    const cleanKey = key.trim().toUpperCase();
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[A-Z0-9]{9}$/.test(cleanKey)) {
      setError("Generate a key first — or paste a valid 9-character key.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Enter a valid work email to claim this key.");
      return;
    }
    setClaimState("loading");
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch("/api/keys/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: cleanKey, email: cleanEmail }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setClaimState("idle");
        setError(data.error || "Couldn't claim this key — try again.");
        return;
      }
      setKey(data.key);
      setClaimState("done");
    } catch {
      setClaimState("idle");
      setError("Couldn't reach the key service — check your connection and try again.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(key);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = key;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="min-h-[100dvh] bg-cream font-grot text-cherry-ink">
      <div className="mesh-a" aria-hidden />
      <div className="grain-v" aria-hidden />
      <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-6">
        <div className="fluid flex w-max items-center gap-4 rounded-full border border-cherry/15 bg-white/70 py-2 pl-5 pr-2 backdrop-blur-2xl">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cherry font-mono2 text-sm text-white">C</span>
            <span className="text-sm font-bold tracking-tight text-cherry-ink">Cherry</span>
          </a>
          <span className="hidden font-mono2 text-[11px] text-muted sm:inline">/ tester keys</span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-32 md:pt-40">
        <RevealV>
          <p className="inline-flex rounded-full border border-cherry/15 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cherry-deep">
            Tester keys
          </p>
          <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-cherry-ink md:text-6xl">
            Mint a key. <span className="text-cherry">Claim it.</span>
          </h1>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-cherry-ink/70">
            One 9-character key per request. Bind it to your work email and it's
            logged as yours — redeemable for a full tester rental.
          </p>
        </RevealV>

        <RevealV index={1}>
          <div className="bezel-outer mt-10">
            <div className="bezel-inner p-6 md:p-8">
              <p className="font-mono2 text-[11px] uppercase tracking-widest text-muted">Step 1 — Mint</p>
              {key ? (
                <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <p className="flex-1 rounded-2xl bg-cherry-ink px-5 py-4 text-center font-mono2 text-2xl tracking-[0.2em] text-white">
                    {key}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copy}
                      className="fluid inline-flex h-11 items-center gap-2 rounded-full border border-cherry/15 bg-white px-5 text-sm font-bold text-cherry-ink active:scale-[0.98]"
                    >
                      {copied ? <Check size={15} weight="light" /> : <CopySimple size={15} weight="light" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      type="button"
                      onClick={generate}
                      disabled={genState === "loading"}
                      className="fluid inline-flex h-11 items-center rounded-full bg-cherry/10 px-5 text-sm font-bold text-cherry-deep active:scale-[0.98] disabled:opacity-50"
                    >
                      {genState === "loading" ? "Minting…" : "New key"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={generate}
                  disabled={genState === "loading"}
                  className="group fluid mt-4 inline-flex items-center gap-3 rounded-full bg-cherry py-2 pl-6 pr-2 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-60"
                >
                  <Keyhole size={16} weight="light" />
                  {genState === "loading" ? "Minting your key…" : "Generate tester key"}
                  <span className="fluid flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                    <ArrowUpRight size={15} weight="light" />
                  </span>
                </button>
              )}

              <div className="mt-8 border-t border-cherry/10 pt-6">
                <p className="font-mono2 text-[11px] uppercase tracking-widest text-muted">Step 2 — Claim</p>
                {claimState === "done" ? (
                  <div className="mt-4">
                    <p className="inline-flex items-center gap-2 rounded-full bg-blush px-3 py-1 text-xs font-bold text-cherry-deep">
                      <SealCheck size={15} weight="light" /> Claimed
                    </p>
                    <p className="font-grot mt-3 text-2xl font-bold tracking-tight text-cherry-ink">
                      {key} is yours, {email.trim().toLowerCase()}.
                    </p>
                    <a
                      href="/thank-you"
                      className="group fluid mt-4 inline-flex items-center gap-3 rounded-full bg-cherry py-2 pl-6 pr-2 text-sm font-bold text-white active:scale-[0.98]"
                    >
                      View your invite
                      <span className="fluid flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                        <ArrowUpRight size={15} weight="light" />
                      </span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={claim} noValidate className="mt-4">
                    <label htmlFor="tk-email" className="text-sm font-semibold text-cherry-ink">Work email</label>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        id="tk-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="mira@atelier.com"
                        className="h-11 flex-1 rounded-full border border-cherry/15 bg-white px-4 text-sm text-cherry-ink outline-none placeholder:text-muted/70 focus:border-cherry"
                      />
                      <button
                        type="submit"
                        disabled={claimState === "loading"}
                        className="group fluid inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-cherry py-2 pl-6 pr-2 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-60"
                      >
                        {claimState === "loading" ? "Claiming…" : "Claim this key"}
                        <span className="fluid flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                          <ArrowUpRight size={15} weight="light" />
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {error && <p className="mt-4 text-[13px] font-medium text-cherry-deep">{error}</p>}
              <p className="mt-4 font-mono2 text-[11px] text-muted">one key per request · 5 requests/second · keys bind to one email</p>
            </div>
          </div>
        </RevealV>
      </main>

      <Footer />
    </div>
  );
}
