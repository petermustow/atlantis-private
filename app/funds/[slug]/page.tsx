import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactSection from "@/components/ContactSection";
import { GatedFundFigures, GatePanel, GateProvider } from "@/components/Gate";
import PageHero from "@/components/PageHero";
import RoleLink from "@/components/RoleLink";
import { fundBySlug, funds } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return funds.map((f) => ({ slug: f.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = fundBySlug((await params).slug);
  return f ? { title: f.name, description: f.desc } : {};
}

export default async function FundPage({ params }: Props) {
  const f = fundBySlug((await params).slug);
  if (!f) notFound();

  return (
    <GateProvider>
      <PageHero eyebrow={f.tag} title={f.name}>
        {f.desc}
      </PageHero>

      <section className="section-sm">
        <div className="wrap split" style={{ gap: 64, alignItems: "flex-start" }}>
          <div className="stack gap-24" style={{ flex: "2 1 460px" }}>
            <Link href="/funds" className="link-strong link-block small">&larr; All funds</Link>
            <h2 className="h2-md">At a glance</h2>
            <div className="stack">
              <div className="kv"><span>Security</span><span>{f.security}</span></div>
              <div className="kv"><span>Term</span><span>{f.term}</span></div>
              <div className="kv"><span>Income</span><span>{f.income}</span></div>
              <div className="kv"><span>Minimum investment</span><span>{f.min}</span></div>
              <div className="kv"><span>Who it suits</span><span>{f.suits}</span></div>
            </div>
            <h2 className="h2-md">How your money is invested</h2>
            <p className="soft">{f.strategy}</p>
            <h2 className="h2-md">Key risks for this fund</h2>
            <ul className="dots">{f.risks.map((r) => <li key={r}>{r}</li>)}</ul>
            <p className="small muted">Returns are targets and are not guaranteed, and you could lose some or all of the money you invest. Full details of the risks are in the Information Memorandum.</p>
          </div>

          <aside className="stack gap-24" style={{ flex: "1 1 320px" }}>
            <GatePanel />
            <GatedFundFigures slug={f.slug} min={f.min} income={f.income} />
            <div className="card-flat">
              <div className="h3">Fund documents</div>
              <div className="soft">The Information Memorandum sets out the full terms, fees and risks. We will send it to you once we have confirmed you are a wholesale investor.</div>
              <RoleLink role="Investor" className="btn">Request the Information Memorandum</RoleLink>
              <Link href="/readiness-check" className="link-strong link-block">Or see how ready you are to invest</Link>
            </div>
          </aside>
        </div>
        <div className="wrap" style={{ marginTop: 40 }}>
          <Link href="/funds" className="link-strong link-block">Compare all our funds</Link>
        </div>
      </section>

      <ContactSection />
    </GateProvider>
  );
}
