import { useRef, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

/* 5 requests / second sliding-window rate limit on attempts */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 1000;

/* Double-bezel access panel — white on blush, cherry pill submit */
export default function AccessPanel() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");
  const [invite, setInvite] = useState(null);
  const attempts = useRef([]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const now = Date.now();
    attempts.current = attempts.current.filter((t) => now - t < RATE_WINDOW_MS);
    if (attempts.current.length >= RATE_LIMIT) {
      setState("error");
      setError("Too many requests — please wait a second and try again.");
      return;
    }
    attempts.current.push(now);
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setState("error");
      setError("Enter a valid work email, for example mira@atelier.com.");
      return;
    }
    setState("loading");
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) {
        setState("error");
        setError(data.error || "Too many requests — please wait a second and try again.");
        return;
      }
      if (!res.ok || !data.invite) {
        setState("error");
        setError(data.error || "Couldn't reserve a key — try again in a moment.");
        return;
      }
      setInvite({ code: data.invite, position: data.position, returning: data.returning });
      setState("done");
    } catch {
      setState("error");
      setError("Couldn't reach the waitlist service — check your connection and try again.");
    }
  };

  return (
    <div className="bezel-outer">
      <div className="bezel-inner p-6 md:p-8">
        {state === "done" ? (
          <div>
            <p className="inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cherry-deep border border-cherry/15 bg-blush">
              Key reserved
            </p>
            <p className="font-grot mt-4 text-3xl font-bold tracking-tight text-cherry-ink">Thank you for trusting Cherry.</p>
            <p className="mt-2 text-sm text-muted">
              {invite?.returning ? "This email is already on the list — welcome back." : "Invite reserved — tester track."}{" "}
              <span className="font-mono2 text-[13px] text-cherry-deep">{invite?.code}</span>
              {typeof invite?.position === "number" && (
                <span> · #{invite.position} in line</span>
              )}
            </p>
            <button
              type="button"
              onClick={() => window.open("/thank-you", "_blank", "noopener")}
              className="group fluid mt-5 inline-flex items-center gap-3 rounded-full bg-cherry py-2 pl-6 pr-2 text-sm font-bold text-white active:scale-[0.98]"
            >
              Open your invite
              <span className="fluid flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <ArrowUpRight size={15} weight="light" />
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <label htmlFor="v-email" className="text-sm font-semibold text-cherry-ink">Work email</label>
            <p className="mt-1 text-[13px] text-muted">One key per team. Tester + creator tracks.</p>
            {state === "loading" ? (
              <div className="mt-5 space-y-3" aria-live="polite">
                <div className="h-4 w-2/3 animate-pulse rounded bg-cherry/10" />
                <div className="h-12 animate-pulse rounded-full bg-cherry/10" />
              </div>
            ) : (
              <>
                <div className="bezel-outer mt-5 !rounded-full">
                  <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-5 pr-1.5 shadow-[inset_0_1px_1px_rgba(209,75,75,0.12)]">
                    <input
                      id="v-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="mira@atelier.com"
                      className="w-full bg-transparent text-sm text-cherry-ink outline-none placeholder:text-muted/70"
                    />
                    <button
                      type="submit"
                      className="group fluid inline-flex shrink-0 items-center gap-2 rounded-full bg-cherry py-2 pl-5 pr-2 text-sm font-bold text-white active:scale-[0.98]"
                    >
                      Submit
                      <span className="fluid flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                        <ArrowUpRight size={15} weight="light" />
                      </span>
                    </button>
                  </div>
                </div>
                {state === "error" && <p className="mt-3 text-[13px] font-medium text-cherry-deep">{error}</p>}
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
