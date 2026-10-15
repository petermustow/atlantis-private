import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import { Tick } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import RoleLink from "@/components/RoleLink";
import ScenarioForm from "@/components/ScenarioForm";
import { lending } from "@/lib/content";

export const metadata: Metadata = {
  title: "Lending",
  description: "Commercial property loans from $250K to $50M and corporate finance from $5M to $100M, settled quickly.",
};

export default function LendingPage() {
  return (
    <>
      <PageHero
        eyebrow="Lending"
        title="Funding for your next project"
        actions={<RoleLink role="Borrower" className="btn">Tell us about your project</RoleLink>}
      >
        When the right opportunity comes along, timing matters. We take the time to understand your project, and we move quickly when you are ready.
      </PageHero>

      <section className="section">
        <div className="wrap stack gap-32">
          <h2 className="h2">What we lend for</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))" }}>
            {lending.loanTypes.map((lt) => (
              <div className="card" key={lt.title}>
                <div className="eyebrow">{lt.range}</div>
                <h3 className="h2-sm">{lt.title}</h3>
                <p className="soft">{lt.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-line">
        <div className="wrap stack gap-32">
          <h2 className="h2">Why borrowers come to us</h2>
          <div className="grid">
            {lending.why.map((w) => (
              <div className="stack gap-12" key={w.title}>
                <div className="accent" />
                <h3 className="h3">{w.title}</h3>
                <p className="soft">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="scenario" className="section section-alt section-line">
        <div className="wrap split" style={{ gap: 56 }}>
          <div className="stack gap-16" style={{ flex: "1 1 300px", maxWidth: 420 }}>
            <div className="eyebrow">For borrowers and brokers</div>
            <h2 className="h2">Tell us about the deal</h2>
            <p className="soft">One short form, about two minutes. We will tell you straight away exactly what to send next, and come back to you within one business day.</p>
            <p className="soft">Most loans settle within 7 to 14 days of your first enquiry. We do not fund construction or development projects.</p>
          </div>
          <div style={{ flex: "2 1 520px" }}>
            <ScenarioForm />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split" style={{ gap: 64 }}>
          <div className="stack gap-16">
            <h2 className="h2-md">What you will need</h2>
            <p className="soft">Having these ready helps us move faster. Do not worry if you do not have everything yet, we can work through it together.</p>
            <ul className="ticks">{lending.docs.map((d) => <li key={d}><Tick /><span>{d}</span></li>)}</ul>
            <p className="small"><span className="placeholder">[Checklist to be confirmed by our lending team.]</span></p>
          </div>
          <div className="stack gap-16">
            <h2 className="h2-md">What we do not lend on</h2>
            <p className="soft">We would rather be upfront, so you do not waste your time.</p>
            <ul className="dots">
              {lending.notLend.map((n) => (
                <li key={n}>{n.startsWith("[") ? <span className="placeholder">{n}</span> : n}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="approval" className="section section-alt section-line">
        <div className="wrap split" style={{ gap: 56 }}>
          <div className="stack gap-16">
            <h2 className="h2-md">How we approve loans</h2>
            <p className="soft">Every loan is reviewed by our credit committee before it is approved, so no single person makes the decision.</p>
            <p className="soft">
              <strong>Credit committee:</strong> Luca Guerra (Managing Director), Lyle Rohde (Director) and Marc-Arion Wan (Investment
              Director and General Counsel). Between them they bring commercial banking, capital raising and legal experience to every decision.
            </p>
          </div>
          <ol className="steps">
            {lending.approval.map((a) => (
              <li key={a.n}>
                <span className="step-n">{a.n}</span>
                <span className="stack"><span className="bold">{a.title}</span><span className="muted">{a.text}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
