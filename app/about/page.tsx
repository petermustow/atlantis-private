import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import { site, about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Our story, how we are governed, and what our clients say. Offices in Melbourne and Singapore.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section-alt" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="wrap split" style={{ padding: "72px 24px", gap: 56 }}>
          <div className="stack gap-16">
            <div className="rule" />
            <h1 className="h1-page">Our story</h1>
            <p className="lead placeholder">[Our story in a few lines: who we are, when we started, and why we have offices in Melbourne and Singapore.]</p>
          </div>
          <div className="grid-sm">
            {site.offices.map((o) => (
              <div className="stack gap-8" key={o.city}>
                <div className="headshot placeholder" style={{ aspectRatio: "4 / 3" }}>[{o.city} photo]</div>
                <div className="h3">{o.city}</div>
                <div className="soft small">{o.lines.map((l, i) => <span key={l}>{l}{i < o.lines.length - 1 && <br />}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="governance" className="section">
        <div className="wrap stack gap-32">
          <div className="stack gap-8">
            <h2 className="h2">How we are governed</h2>
            <p className="lead">The rules we hold ourselves to, in plain English.</p>
          </div>
          <div className="grid">
            {about.govern.map((g) => (
              <div className="card-flat" key={g.title}>
                <div className="accent" />
                <span className="bold">{g.title}</span>
                <span className="soft">{g.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Recognition" className="section section-alt">
        <div className="wrap stack gap-32">
          <div className="stack gap-8">
            <h2 className="h2">Recognition</h2>
            <p className="lead">Recognition earned by our Managing Director, Luca Guerra, for his work in commercial finance broking.</p>
          </div>
          <div className="grid-sm">
            {about.awards.map((a) => (
              <div className="card-flat" key={a.title + a.year}>
                <span className="eyebrow">{a.result} &middot; {a.year}</span>
                <span className="bold">{a.title}</span>
                <span className="muted small">{a.org}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" aria-label="What our clients say" className="section">
        <div className="wrap stack gap-32">
          <h2 className="h2">What our clients say</h2>
          <div className="grid">
            {about.quotes.map((q) => (
              <figure className="card" key={q.who} style={{ margin: 0 }}>
                <div className="accent" />
                <blockquote style={{ fontSize: 24 }}><span className="placeholder">&ldquo;[Short quote from a real {q.who}, used with their permission.]&rdquo;</span></blockquote>
                <figcaption className="stack"><span className="bold placeholder" style={{ alignSelf: "flex-start" }}>[Name]</span><span className="muted small">{q.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
