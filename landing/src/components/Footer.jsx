import { ArrowUp, ArrowUpRight, EnvelopeSimple } from "@phosphor-icons/react";
import RevealV from "./RevealV";

const PRODUCT = [
  ["Runtime", "/#runtime"],
  ["Protocol", "/#protocol"],
  ["Pack index", "/#packs"],
  ["Get access", "/#access"],
];

const MARKET = [
  ["Browse packs", "/#packs"],
  ["How renting works", "/#protocol"],
  ["Get a tester key", "/test-keys"],
  ["Sample invite", "/thank-you"],
];

const LEGAL = [
  ["Terms", "/terms"],
  ["Privacy", "/privacy"],
  ["Refunds", "/refunds"],
  ["Security", "/security"],
];

/* Full-bleed rainy-night footer — every link resolves to a real page or section */
export default function Footer() {
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative overflow-hidden">
      <img
        src="/night-footer.jpg"
        alt="Black cat watching city rain at night from a warm lamplit room"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to bottom, #FFFBF9 0%, rgba(255,251,249,0.05) 20%, rgba(8,6,18,0.55) 42%, rgba(8,6,18,0.78) 68%, rgba(5,3,10,0.95) 100%)" }}
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-8 pt-28 md:pt-36">
        <RevealV>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <h2
              className="max-w-[16ch] text-4xl font-extrabold leading-[1.02] tracking-tight text-white md:text-6xl"
              style={{ textShadow: "0 2px 28px rgba(5,2,8,0.85), 0 1px 3px rgba(5,2,8,0.9)" }}
            >
              Rent the context.{" "}
              <span
                className="text-[#FFD9DE]"
                style={{ textShadow: "0 0 36px rgba(209,75,75,0.8), 0 2px 14px rgba(5,2,8,0.9)" }}
              >
                Keep the memory.
              </span>
            </h2>
            <a
              href="/test-keys"
              className="group fluid inline-flex shrink-0 items-center gap-3 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-bold text-cherry-ink active:scale-[0.98]"
            >
              Get a tester key
              <span className="fluid flex h-8 w-8 items-center justify-center rounded-full bg-cherry/10 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                <ArrowUpRight size={16} weight="light" />
              </span>
            </a>
          </div>
        </RevealV>

        <RevealV index={1}>
          <div className="mt-14 grid grid-cols-2 gap-10 border-t border-white/15 pt-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1">
              <a href="/" className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cherry font-mono2 text-sm text-white">C</span>
                <span className="text-sm font-bold tracking-tight text-white">Cherry</span>
              </a>
              <p className="mt-4 max-w-[32ch] text-sm leading-relaxed text-white/70">
                A marketplace and runtime where agents rent versioned, cited
                context — instead of re-learning the world per task.
              </p>
              <a
                href="mailto:hello@cherry.ctx"
                className="fluid mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-2xl hover:bg-white/20"
              >
                <EnvelopeSimple size={16} weight="light" /> hello@cherry.ctx
              </a>
              <a href="/status" className="fluid mt-3 inline-flex items-center gap-2 font-mono2 text-xs text-white/70 hover:text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                All systems operational — status
              </a>
            </div>

            <nav aria-label="Product">
              <p className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-white/40">Product</p>
              <ul className="mt-4 space-y-2.5">
                {PRODUCT.map(([t, h]) => (
                  <li key={h + t}>
                    <a href={h} className="fluid text-sm font-medium text-white/75 hover:text-white">{t}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Marketplace">
              <p className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-white/40">Marketplace</p>
              <ul className="mt-4 space-y-2.5">
                {MARKET.map(([t, h]) => (
                  <li key={h + t}>
                    <a href={h} className="fluid text-sm font-medium text-white/75 hover:text-white">{t}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Legal">
              <p className="font-mono2 text-[11px] uppercase tracking-[0.2em] text-white/40">Legal</p>
              <ul className="mt-4 space-y-2.5">
                {LEGAL.map(([t, h]) => (
                  <li key={h}>
                    <a href={h} className="fluid text-sm font-medium text-white/75 hover:text-white">{t}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </RevealV>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-[13px] text-white/60 md:flex-row md:items-center">
          <p>© 2026 Cherry — rented context for agents</p>
          <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono2 text-xs md:mx-auto">
            <a href="/terms" className="fluid hover:text-white">terms</a>
            <a href="/privacy" className="fluid hover:text-white">privacy</a>
            <a href="/refunds" className="fluid hover:text-white">refunds</a>
            <a href="/security" className="fluid hover:text-white">security</a>
          </p>
          <button
            type="button"
            onClick={toTop}
            className="fluid inline-flex w-max items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-2xl hover:bg-white/20 active:scale-[0.98]"
          >
            Back to top <ArrowUp size={14} weight="light" />
          </button>
        </div>
      </div>
    </footer>
  );
}
