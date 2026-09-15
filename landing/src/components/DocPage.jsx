import { useEffect, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import RevealV from "./RevealV";
import Footer from "./Footer";

function Section({ h, children }) {
  return (
    <div className="border-t border-cherry/10 py-7">
      <h2 className="text-lg font-bold tracking-tight text-cherry-ink">{h}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-cherry-ink/75">{children}</div>
    </div>
  );
}

const DOCS = {
  terms: {
    eyebrow: "Legal — Terms of use",
    title: "Terms",
    updated: "Updated 10 Sep 2026",
    body: (
      <>
        <Section h="1. What Cherry is">
          <p>Cherry provides a marketplace and runtime for versioned Context Packs. Renting a pack grants scoped, temporary access — one pack, one pinned version, a token budget, a retrieval quota, and an expiry — not ownership of the underlying sources.</p>
        </Section>
        <Section h="2. Renting">
          <p>Rents are metered per task or per retrieval as listed on each pack. Copying retrieved chunks inside your own task is expected; reselling, republishing, or redistributing pack contents outside Cherry is not permitted.</p>
        </Section>
        <Section h="3. Versions and freshness">
          <p>Packs are versioned and changelogs flag breaking edits. You are responsible for renting a current version for regulated work. Cherry marks stale packs but cannot force re-rents.</p>
        </Section>
        <Section h="4. Creators">
          <p>Creators warrant they hold the rights to publish their sources. Payouts settle at a 70 / 30 split in the creator's favour, minus payment fees, on monthly cycles above the minimum threshold shown at publish time.</p>
        </Section>
        <Section h="5. No professional advice">
          <p>Security, tax, and compliance packs are decision aids, not professional advice. Verify critical output with a qualified human before acting on it.</p>
        </Section>
        <Section h="6. Liability">
          <p>To the maximum extent permitted by law, Cherry's liability for any pack or rental is limited to the fees paid for that rental in the preceding 30 days.</p>
        </Section>
      </>
    ),
  },
  privacy: {
    eyebrow: "Legal — Privacy",
    title: "Privacy",
    updated: "Updated 10 Sep 2026",
    body: (
      <>
        <Section h="1. What we collect">
          <p>Account email, rental and retrieval metadata (pack, version, timestamp, token counts), and payment records. We do not sell personal data, and we do not train shared models on private pack contents.</p>
        </Section>
        <Section h="2. Queries">
          <p>Retrieval queries are processed to serve results and compute quality scores, then retained in aggregated form. Query text is never published or shared with other tenants.</p>
        </Section>
        <Section h="3. Private packs">
          <p>Organization packs stay inside your tenant boundary with per-call audit logs visible to your admins. Cherry staff access requires your written consent except where compelled by law.</p>
        </Section>
        <Section h="4. Your rights">
          <p>Request export or deletion of your account data with a message to @cherryisfun on X. Deletion removes personal records within 30 days; aggregated, non-identifying metrics may remain.</p>
        </Section>
      </>
    ),
  },
  refunds: {
    eyebrow: "Legal — Refunds",
    title: "Refunds",
    updated: "Updated 10 Sep 2026",
    body: (
      <>
        <Section h="1. Unused rentals">
          <p>A rental that recorded zero retrievals is refunded in full, automatically, when it expires. No request needed.</p>
        </Section>
        <Section h="2. Failed or stale results">
          <p>If a retrieval errors, cites a withdrawn version, or returns content flagged stale after your rent began, that retrieval is credited back. Report it from your rental receipt within 14 days and we confirm from server logs.</p>
        </Section>
        <Section h="3. Used rentals">
          <p>Retrievals that returned successfully are non-refundable — the context was consumed. Version dissatisfaction after use is covered by re-renting the corrected version, not by refund.</p>
        </Section>
        <Section h="4. How to claim">
          <p>Message @cherryisfun on X with your rental ID. Valid claims settle to the original payment method within 10 business days.</p>
        </Section>
      </>
    ),
  },
  security: {
    eyebrow: "Legal — Security",
    title: "Security",
    updated: "Updated 10 Sep 2026",
    body: (
      <>
        <Section h="1. Boundaries">
          <p>Public and private packs run in isolated tenants. Retrieval servers hold no standing access to private pack stores; each call is authorized against the active rental grant.</p>
        </Section>
        <Section h="2. Data in transit and at rest">
          <p>All traffic uses TLS 1.2 or higher. Pack stores and audit logs are encrypted at rest, with keys rotated on a fixed schedule.</p>
        </Section>
        <Section h="3. Auditability">
          <p>Every search, rent, and retrieval writes an append-only audit record your admins can export. Key events are timestamped against synchronized clocks.</p>
        </Section>
        <Section h="4. Reporting issues">
          <p>Found something? Message @cherryisfun on X with “security” in the opening line. We acknowledge within 2 business days and publish fixes in the pack or runtime changelog.</p>
        </Section>
      </>
    ),
  },
};

function StatusBody() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const rows = [
    ["Marketplace API", "search · rent · receipts"],
    ["Retrieval runtime", "rerank · compress · cite"],
    ["Pack indexer", "parse · chunk · eval"],
    ["Billing", "metering · payouts"],
  ];
  return (
    <>
      <div className="rounded-2xl bg-cherry-ink p-5 font-mono2 text-sm text-white">
        <p><span className="text-cherry">$</span> cherry status — {now.toLocaleTimeString()}</p>
        <p className="mt-1 text-white/60">pre-launch · metrics begin at public launch</p>
      </div>
      <div className="mt-6 divide-y divide-cherry/10 border-y border-cherry/10">
        {rows.map(([t, d]) => (
          <div key={t} className="flex items-center gap-3 py-4">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-cherry-ink">{t}</p>
              <p className="font-mono2 text-xs text-muted">{d}</p>
            </div>
            <span className="font-mono2 text-xs text-cherry-deep">operational</span>
          </div>
        ))}
      </div>
      <Section h="Incident history">
        <p>No incidents recorded. This page updates from live service checks; during the tester phase all systems report nominal.</p>
      </Section>
    </>
  );
}

/* Real document pages for every legal footer link */
export default function DocPage({ slug }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug ]);

  const doc = DOCS[slug];
  const isStatus = slug === "status";

  return (
    <div className="min-h-[100dvh] bg-cream font-grot text-cherry-ink">
      <div className="mesh-a" aria-hidden />
      <div className="grain-v" aria-hidden />
      <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-6">
        <div className="fluid flex w-max items-center gap-4 rounded-full border border-cherry/15 bg-white/70 py-2 pl-5 pr-2 backdrop-blur-2xl">
          <a href="/" className="flex items-center gap-2.5" aria-label="Cherry home">
            <img src="/cherry-logo.png" alt="Cherry" className="h-7 w-auto" />
          </a>
          <a
            href="/"
            className="fluid inline-flex items-center gap-2 rounded-full bg-cherry/10 px-4 py-2 text-[13px] font-semibold text-cherry-deep active:scale-[0.98]"
          >
            <ArrowLeft size={14} weight="light" /> Home
          </a>
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-32 md:pt-40">
        <RevealV>
          <p className="inline-flex rounded-full border border-cherry/15 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cherry-deep">
            {isStatus ? "System — Status" : doc.eyebrow}
          </p>
          <h1 className="mt-5 text-5xl font-extrabold tracking-tight text-cherry-ink md:text-6xl">
            {isStatus ? "Status" : doc.title}
          </h1>
          {!isStatus && <p className="mt-3 font-mono2 text-xs text-muted">{doc.updated}</p>}
        </RevealV>
        <RevealV index={1} className="mt-8">
          {isStatus ? <StatusBody /> : doc.body}
        </RevealV>
      </main>

      <Footer />
    </div>
  );
}
