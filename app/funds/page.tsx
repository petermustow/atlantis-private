import type { Metadata } from "next";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import { GateBanner, GatedFundFigures, GateProvider } from "@/components/Gate";
import PageHero from "@/components/PageHero";
import { fundExtras, funds } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our funds",
  description: "Three wholesale funds for different goals: steady income, higher income, or income with access to your money.",
};

export default function FundsPage() {
  return (
    <GateProvider>
      <PageHero eyebrow="Invest" title="Our funds">
        Three wholesale funds for different goals: steady income, higher income, or income with access to your money when you need it.
      </PageHero>

      <section className="section-sm">
        <div className="wrap grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))" }}>
          {funds.map((f) => (
            <div className="card" key={f.slug}>
              <span className="badge">{f.tag}</span>
              <h2 className="h2-sm">{f.name}</h2>
              <p className="soft">{f.desc}</p>
              <ul className="dots">{f.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              <GatedFundFigures slug={f.slug} min={f.min} income={f.income} compact />
              <div><Link href={`/funds/${f.slug}`} className="link-strong link-block">View fund details</Link></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="callout callout-gold row between" style={{ padding: 28 }}>
            <div className="stack gap-8" style={{ maxWidth: 640 }}>
              <div className="eyebrow">Not sure where to start?</div>
              <div className="h3">See how ready you are to invest</div>
              <div className="soft">Eleven short questions, about five minutes. You get a personal summary of the steps ahead and how long each one usually takes, and one of our team will call you to talk it through.</div>
            </div>
            <Link href="/readiness-check" className="btn">Start the readiness check</Link>
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="wrap"><GateBanner /></div>
      </section>

      <section className="section section-alt section-line">
        <div className="wrap split" style={{ gap: 64 }}>
          <div className="stack gap-16">
            <h2 className="h2">How we look after your capital</h2>
            <p className="soft">Every loan in our mortgage funds is secured by Australian real estate. Our fund manager also invests alongside our investors, so our interests are aligned with yours.</p>
          </div>
          <ul className="dots">{fundExtras.philosophy.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div className="wrap stack gap-24" style={{ marginTop: 64 }}>
          <h2 className="h2-md">Risks, defaults and your money</h2>
          <div className="grid">
            {fundExtras.risks.map((r) => (
              <div className="card-flat" key={r.title}>
                <span className="bold">{r.title}</span>
                <span className="soft">{r.text}</span>
              </div>
            ))}
          </div>
          <p className="small muted">General information only. Full details of the risks are set out in the Information Memorandum.</p>
        </div>
      </section>

      <section id="fees" className="section">
        <div className="wrap split" style={{ gap: 64 }}>
          <div className="stack gap-16">
            <h2 className="h2-md">Fees</h2>
            <p className="soft">Target returns are quoted after our fund management fees, so the returns we show are what we aim to pay you.</p>
            <p className="soft">Every fee is set out in full in each fund&rsquo;s Information Memorandum. We take you through them on your first call, and send the Information Memorandum once we have confirmed you are a wholesale investor.</p>
            <div><Link href="#contact" className="btn">Talk to us about fees</Link></div>
          </div>
          <div className="stack gap-16">
            <h2 className="h2-md">Who looks after the funds</h2>
            <p className="soft">Our funds are overseen by licensed organisations alongside our own team, so you are not relying on us alone.</p>
            <ul>
              {fundExtras.providers.map((pv) => (
                <li className="list-row" key={pv.role}>
                  <span><span className="eyebrow">{pv.role}</span> <span className="bold">{pv.name}</span></span>
                  <span className="muted small">{pv.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ContactSection />
    </GateProvider>
  );
}
