import { ArrowLeft, ArrowUpRight, SealCheck } from "@phosphor-icons/react";
import RevealV from "./RevealV";

/* /thank-you — sakura canopy full-bleed, white veil, centered bezel card */
export default function ThankYou() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-cream font-grot text-cherry-ink">
      <img
        src="/sakura-thankyou.jpg"
        alt="Sakura blossoms canopy against a pale sky"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(255,251,249,0.94) 8%, rgba(255,251,249,0.45) 45%, rgba(255,251,249,0.12) 70%, rgba(255,251,249,0.25) 100%)" }}
        aria-hidden
      />
      <div className="grain-v" aria-hidden />

      <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-6">
        <div className="fluid flex w-max items-center gap-2.5 rounded-full border border-cherry/15 bg-white/70 py-2 pl-3 pr-5 backdrop-blur-2xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cherry font-mono2 text-sm text-white">C</span>
          <span className="text-sm font-bold tracking-tight text-cherry-ink">Cherry</span>
        </div>
      </div>

      <main className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-3xl flex-col items-center justify-end px-4 pb-16 pt-32 md:justify-center md:pb-24">
        <RevealV className="w-full">
          <div className="bezel-outer">
            <div className="bezel-inner bg-white/85 p-8 text-center backdrop-blur-2xl md:p-12">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cherry text-white">
                <SealCheck size={28} weight="light" />
              </span>
              <p className="mt-6 inline-flex rounded-full border border-cherry/15 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cherry-deep">
                Key reserved · Invite 04-117
              </p>
              <h1 className="mx-auto mt-4 max-w-[16ch] text-4xl font-extrabold leading-[1.02] tracking-tight text-cherry-ink md:text-6xl">
                Thank you for trusting <span className="text-cherry">Cherry.</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[46ch] text-[15px] leading-relaxed text-cherry-ink/70">
                Your tester key is on its way. One pack, one task, fully cited —
                solana-security@4.2 is already shelved under your name.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/"
                  className="group fluid inline-flex items-center gap-3 rounded-full bg-cherry py-2 pl-6 pr-2 text-sm font-semibold text-white active:scale-[0.98]"
                >
                  Back to Cherry
                  <span className="fluid flex h-8 w-8 items-center justify-center rounded-full bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                    <ArrowLeft size={16} weight="light" />
                  </span>
                </a>
                <a
                  href="/#protocol"
                  className="group fluid inline-flex items-center gap-3 rounded-full border border-cherry/15 bg-white py-2 pl-6 pr-2 text-sm font-semibold text-cherry-ink active:scale-[0.98]"
                >
                  Read the protocol
                  <span className="fluid flex h-8 w-8 items-center justify-center rounded-full bg-cherry/10 group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105">
                    <ArrowUpRight size={16} weight="light" />
                  </span>
                </a>
              </div>
              <p className="mt-8 font-mono2 text-[11px] uppercase tracking-widest text-muted">
                search · rent · retrieve · cherrified
              </p>
            </div>
          </div>
        </RevealV>
      </main>
    </div>
  );
}
