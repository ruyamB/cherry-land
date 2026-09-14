import { ArrowUpRight } from "@phosphor-icons/react";

/* Nested island CTA: cherry pill + button-in-button trailing icon */
export default function IslandButton({ children, href = "#access", secondary = false }) {
  const skin = secondary
    ? "bg-white text-cherry-ink border border-cherry/15"
    : "bg-cherry text-white";
  const well = secondary ? "bg-cherry/10" : "bg-white/20";
  return (
    <a
      href={href}
      className={`group fluid inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-semibold active:scale-[0.98] ${skin}`}
    >
      <span>{children}</span>
      <span className={`fluid flex h-8 w-8 items-center justify-center rounded-full group-hover:translate-x-1 group-hover:-translate-y-[1px] group-hover:scale-105 ${well}`}>
        <ArrowUpRight size={16} weight="light" />
      </span>
    </a>
  );
}
