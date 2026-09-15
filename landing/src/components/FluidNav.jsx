import { useEffect, useState } from "react";

/* Floating island nav — white glass pill + morphing hamburger + full overlay */
const LINKS = [
  ["Runtime", "#runtime", "Rent cited chunks, never dumps"],
  ["Protocol", "#protocol", "search · rent · retrieve"],
  ["Keys", "/test-keys", "mint · claim · 9-char"],
  ["Access", "#access", "Tester keys, creator payouts"],
];

export default function FluidNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open ]);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-6">
        <div className="fluid flex w-max items-center gap-4 rounded-full border border-cherry/15 bg-white/70 py-2 pl-5 pr-2 backdrop-blur-2xl">
          <a href="#top" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <img src="/cherry-logo.png" alt="Cherry" className="h-7 w-auto" />
            <span className="hidden font-mono2 text-[11px] text-muted sm:inline">/ ctx index</span>
          </a>
          <nav className="ml-4 hidden items-center gap-5 text-[13px] font-medium text-cherry-ink/60 lg:flex">
            {LINKS.map(([t, h]) => (
              <a key={h} href={h} className="fluid hover:text-cherry">{t}</a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="fluid relative flex h-10 w-10 items-center justify-center rounded-full bg-cherry/10 active:scale-[0.98]"
          >
            <span className={`absolute h-[1.5px] w-5 bg-cherry fluid ${open ? "rotate-45" : "-translate-y-[4px]"}`} />
            <span className={`absolute h-[1.5px] w-5 bg-cherry fluid ${open ? "-rotate-45" : "translate-y-[4px]"}`} />
          </button>
        </div>
      </div>

      <div
        className={`fluid fixed inset-0 z-30 bg-cream/85 backdrop-blur-3xl ${open ? "menu-open opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col justify-center px-6">
          {LINKS.map(([t, h, d]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="mask-item group flex items-baseline gap-5 border-b border-cherry/10 py-6"
            >
              <span className="font-grot text-4xl font-bold tracking-tight text-cherry-ink md:text-6xl">{t}</span>
              <span className="font-mono2 text-xs text-muted">{d}</span>
            </a>
          ))}
          <p className="mask-item mt-8 font-mono2 text-xs text-muted">search · rent · retrieve · list · update</p>
        </div>
      </div>
    </>
  );
}
