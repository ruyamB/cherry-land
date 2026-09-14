import {
  FileText,
  Keyhole,
  LockKey,
  MagnifyingGlass,
  Package,
  ShieldCheck,
} from "@phosphor-icons/react";
import RevealV from "./components/RevealV";
import FluidNav from "./components/FluidNav";
import IslandButton from "./components/IslandButton";
import AccessPanel from "./components/AccessPanel";
import Footer from "./components/Footer";

function Eyebrow({ children }) {
  return (
    <p className="inline-flex rounded-full border border-cherry/15 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cherry-deep">
      {children}
    </p>
  );
}

function Bezel({ children, className = "" }) {
  return (
    <div className={`bezel-outer ${className}`}>
      <div className="bezel-inner p-6 md:p-8">{children}</div>
    </div>
  );
}

const CHECKS = [
  ["Signer check", "Anchor docs · Mar 2026", "0.96"],
  ["Owner check", "Audit notes · Feb 2026", "0.94"],
  ["PDA seed check", "Exploit report · Jan 2026", "0.91"],
];

const PACKS = [
  { name: "solana-security@4.2", by: "Rian Kaplan", meta: "47 sources · 3d ago", q: "94.1", price: "₹2 / task" },
  { name: "indian-gst-saas@2.8", by: "Mira Krishnan", meta: "31 sources · 2d ago", q: "96.3", price: "₹5 / retrieval" },
  { name: "kubernetes-prod@3.5", by: "Tomas Hanaoka", meta: "52 sources · 6h ago", q: "91.7", price: "₹3 / task" },
];

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-cream font-grot text-cherry-ink">
      <div className="mesh-a" aria-hidden />
      <div className="mesh-b" aria-hidden />
      <div className="grain-v" aria-hidden />
      <FluidNav />

      <main id="top">
        {/* HERO — sakura grove full-bleed, centered */}
        <section className="relative overflow-hidden">
          <img
            src="/sakura-hero.jpg"
            alt="Sakura grove in full bloom over a flower meadow"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(255,251,249,0.72) 0%, rgba(255,251,249,0.55) 40%, rgba(255,251,249,0.78) 72%, #FFFBF9 100%)" }}
            aria-hidden
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-32 text-center md:pt-40">
            <RevealV>
              <Eyebrow>Only app to make your agents better. </Eyebrow>
              <h1 className="mx-auto mt-6 max-w-[14ch] text-5xl font-extrabold leading-[0.98] tracking-tight text-cherry-ink md:text-7xl">
                Get Context
                <br />
                <span className="text-cherry">for Agents.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-cherry-ink/70">
                Cherry is a marketplace and runtime for specialized knowledge. Agents
                search a pack, rent it for one task, and retrieve only the cited
                chunks the work needs — small memory in, sourced answers out.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <IslandButton>Start Buying</IslandButton>
                <IslandButton href="#protocol" secondary>Read protocol</IslandButton>
              </div>
              <dl className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-cherry/10 pt-6 text-center">
                {[
                  ["1,284", "rentals today"],
                  ["312 ms", "median retrieve"],
                  ["47.2 M", "tokens kept out"],
                ].map(([v, k]) => (
                  <div key={k}>
                    <dt className="font-mono2 text-lg text-cherry-ink">{v}</dt>
                    <dd className="mt-1 text-[11px] uppercase tracking-wider text-muted">{k}</dd>
                  </div>
                ))}
              </dl>
            </RevealV>

            <RevealV index={1} className="mx-auto mt-12 max-w-2xl text-left">
              <Bezel>
                <div className="flex items-center justify-between">
                  <p className="font-mono2 text-[11px] uppercase tracking-widest text-muted">retrieve · live</p>
                  <span className="rounded-full bg-cherry px-2.5 py-1 font-mono2 text-[11px] text-white">
                    cited 3/3
                  </span>
                </div>
                <div className="mt-4 rounded-2xl bg-cherry-ink p-4 font-mono2 text-[12.5px] leading-relaxed text-white">
                  <p><span className="text-cherry">$</span> cherry get context "Indian Gst Laws 2026"</p>
                </div>
                <div className="mt-3 divide-y divide-cherry/10">
                  {CHECKS.map(([t, s, c]) => (
                    <div key={t} className="flex items-center gap-3 py-3">
                      <ShieldCheck size={20} weight="light" className="shrink-0 text-cherry" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-cherry-ink">{t}</p>
                        <p className="truncate font-mono2 text-xs text-muted">{s}</p>
                      </div>
                      <span className="font-mono2 text-xs text-cherry-deep">{c}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 font-mono2 text-[11px] text-muted">3 chunks · 1.2k tokens · 500-page pack never sent</p>
              </Bezel>
            </RevealV>
          </div>
        </section>

        {/* RUNTIME BENTO — 8/4 masonry */}
        <section id="runtime" className="mx-auto w-full max-w-6xl px-4 py-24 md:py-40">
          <RevealV>
            <Eyebrow>01 — Runtime</Eyebrow>
            <h2 className="mt-5 max-w-[20ch] text-4xl font-extrabold tracking-tight text-cherry-ink md:text-6xl">
              Retrieve. Rerank. <span className="text-cherry">Compress. Cite.</span>
            </h2>
          </RevealV>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <RevealV className="lg:col-span-8">
              <Bezel className="h-full">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cherry text-white">
                  <Package size={22} weight="light" />
                </span>
                <h3 className="mt-5 text-2xl font-bold tracking-tight text-cherry-ink">Top-k in, everything else stays out</h3>
                <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-cherry-ink/70">
                  Intent → select → retrieve → rerank → compress → verify. The model
                  receives short, versioned context with claim, source, document,
                  and date — never a dumped PDF.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 font-mono2 text-[12.5px] sm:grid-cols-3">
                  {['$ context search "Anchor validation"', "$ context rent @4.2 --budget 100k", "$ context retrieve --top-k 3"].map((c) => (
                    <p key={c} className="rounded-xl bg-cherry-ink px-3 py-3 text-white">{c}</p>
                  ))}
                </div>
              </Bezel>
            </RevealV>
            <RevealV index={1} className="lg:col-span-4">
              <Bezel className="h-full">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blush text-cherry-deep">
                  <MagnifyingGlass size={22} weight="light" />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-cherry-ink">Pinned versions</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-cherry-ink/70">
                  @4.2 stays fixed until re-rented. Breaking regulation edits ship
                  as flagged releases, never silent drift.
                </p>
              </Bezel>
            </RevealV>
            <RevealV index={2} className="lg:col-span-4">
              <Bezel className="h-full">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blush text-cherry-deep">
                  <FileText size={22} weight="light" />
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-cherry-ink">Provenance chain</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-cherry-ink/70">
                  Every statement resolves to document, URL, publication date,
                  and last verification pass.
                </p>
              </Bezel>
            </RevealV>
            <RevealV index={3} className="lg:col-span-8">
              <Bezel className="h-full">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cherry text-white">
                    <LockKey size={22} weight="light" />
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight text-cherry-ink">Private packs, same runtime</h3>
                </div>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-cherry-ink/70">
                  Runbooks, policies, and internal APIs stay inside your boundary
                  with per-call audit logs — while public packs fund their authors
                  per retrieval.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 font-mono2 text-[11px] text-cherry-deep">
                  <span className="rounded-full border border-cherry/15 bg-white px-3 py-1">org scope</span>
                  <span className="rounded-full border border-cherry/15 bg-white px-3 py-1">audit trail</span>
                  <span className="rounded-full bg-cherry px-3 py-1 text-white">70 / 30 payout</span>
                </div>
              </Bezel>
            </RevealV>
          </div>
        </section>

        {/* PROTOCOL */}
        <section id="protocol" className="mx-auto w-full max-w-6xl px-4 py-24 md:py-40">
          <RevealV>
            <Eyebrow>02 — Protocol</Eyebrow>
            <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-cherry-ink md:text-6xl">Three moves.</h2>
          </RevealV>
          <div className="mt-12">
            {[
              { icon: MagnifyingGlass, t: "Search versioned packs", d: "Quality, source counts, freshness — computed from evals." },
              { icon: Keyhole, t: "Rent for one task", d: "Scoped grant: pack, version, budget, quota, expiry." },
              { icon: Package, t: "Retrieve cited chunks", d: "Compressed answers with confidence and sources." },
            ].map((s, i) => (
              <RevealV key={s.t} index={i}>
                <div className="fluid flex items-center gap-5 border-t border-cherry/10 py-7 last:border-b">
                  <span className="font-mono2 text-sm text-cherry/60">0{i + 1}</span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cherry text-white">
                    <s.icon size={20} weight="light" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold tracking-tight text-cherry-ink">{s.t}</p>
                    <p className="mt-1 text-sm text-muted">{s.d}</p>
                  </div>
                </div>
              </RevealV>
            ))}
          </div>
        </section>

        {/* INDEX BENTO */}
        <section id="packs" className="mx-auto w-full max-w-6xl px-4 py-24 md:py-40">
          <RevealV>
            <Eyebrow>03 — Index</Eyebrow>
            <h2 className="mt-5 max-w-[18ch] text-4xl font-extrabold tracking-tight text-cherry-ink md:text-6xl">
              Cherrypick <span className="text-cherry">a pack.</span>
            </h2>
          </RevealV>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <RevealV className="lg:col-span-8">
              <Bezel className="h-full">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono2 text-sm text-cherry-ink">solana-security@4.2</p>
                  <span className="rounded-full bg-cherry px-3 py-1 font-mono2 text-[11px] text-white">94.1 / 100</span>
                </div>
                <p className="mt-3 max-w-[54ch] text-[15px] text-cherry-ink/70">
                  Anchor validation, PDA checks, CPI risks. 47 sources, historical
                  exploit pairs with fixed counterparts. Updated 3 days ago.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-cherry/10 pt-5">
                  <span className="font-mono2 text-sm font-medium text-cherry-ink">₹2 / task</span>
                  <span className="font-mono2 text-xs text-muted">Rian Kaplan · audit researcher</span>
                </div>
              </Bezel>
            </RevealV>
            <div className="grid grid-cols-1 gap-6 lg:col-span-4">
              {PACKS.slice(1).map((p, i) => (
                <RevealV key={p.name} index={i + 1}>
                  <Bezel>
                    <p className="font-mono2 text-[13px] text-cherry-ink">{p.name}</p>
                    <p className="mt-2 font-mono2 text-xs text-muted">{p.meta}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-cherry/10 pt-4">
                      <span className="font-mono2 text-[13px] text-cherry-ink">{p.price}</span>
                      <span className="rounded-full bg-blush px-2.5 py-0.5 font-mono2 text-[11px] text-cherry-deep">{p.q}</span>
                    </div>
                  </Bezel>
                </RevealV>
              ))}
            </div>
          </div>
        </section>

        {/* ACCESS */}
        <section id="access" className="mx-auto w-full max-w-6xl px-4 py-24 md:py-40">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-10">
            <RevealV className="lg:col-span-7">
              <Eyebrow>04 — Access</Eyebrow>
              <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-cherry-ink md:text-6xl">
                Start with <span className="text-cherry">one audit.</span>
              </h2>
              <p className="mt-5 max-w-[50ch] text-[15px] leading-relaxed text-cherry-ink/70">
                Testers get API endpoints, premium features, to make Cherry-picking easy.
              </p>
              <div className="mt-7 hidden lg:block">
                <IslandButton href="#top" secondary>Back to top</IslandButton>
              </div>
            </RevealV>
            <RevealV index={1} className="lg:col-span-5">
              <AccessPanel />
            </RevealV>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
