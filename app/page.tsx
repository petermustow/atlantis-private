import Image from "next/image";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import RoleLink from "@/components/RoleLink";
import DealCard from "@/components/DealCard";
import { deals, funds, howItWorks, site, team } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="wrap home-hero-in">
          <div className="home-hero-copy">
            <div className="rule" />
            <h1 className="h1">We work with you, for you</h1>
            <p className="lead">Lending, private credit and private equity under one roof, with offices in Melbourne and Singapore.</p>
            <div className="row" style={{ marginTop: 8 }}>
              <Link href="#funds" className="btn">I&rsquo;m looking to invest</Link>
              <Link href="#lending" className="btn btn-outline">I&rsquo;m looking to borrow</Link>
            </div>
          </div>
          <Image
            className="home-hero-img"
            src="/img/directors.jpg"
            alt="The Atlantis Private directors"
            width={1160}
            height={1192}
            priority
            sizes="(max-width: 900px) 100vw, 560px"
          />
        </div>
      </section>

      <section className="figures" aria-label="Key figures">
        <div className="figures-in">
          {site.figures.map((f) => (
            <div key={f.label}>
              <div className="figure-n">{f.n}</div>
              <div className="muted">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap stack gap-36">
          <h2 className="h2">How we can work together</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))" }}>
            <div className="card" id="funds">
              <div className="eyebrow">For investors</div>
              <h3 className="h2-sm">Our funds</h3>
              <p className="soft">Every investor has different goals. We would love to hear yours and show you which of our funds could suit you.</p>
              <div className="stack">
                {funds.map((f) => (
                  <div className="list-row" key={f.slug}>
                    <span className="bold">{f.name.replace("Atlantis ", "")}</span>
                    <span className="muted small">{homeBlurb[f.slug]}</span>
                  </div>
                ))}
              </div>
              <p className="small muted">
                Available to wholesale investors only. <Link href="/funds" className="link-strong">Learn about our funds</Link> or our{" "}
                <Link href="/private-equity" className="link-strong">private equity fund</Link>.
              </p>
              <div className="row">
                <Link href="/readiness-check" className="btn">See how ready you are to invest</Link>
                <RoleLink role="Investor" className="link-strong link-block">or talk to us about your goals</RoleLink>
              </div>
            </div>

            <div className="card" id="lending">
              <div className="eyebrow">For borrowers</div>
              <h3 className="h2-sm">Lending</h3>
              <div className="stack">
                <div className="kv"><span>Commercial property</span><span>AUD $250k to $50m</span></div>
                <div className="kv"><span>Corporate finance</span><span>AUD $5m to $100m</span></div>
              </div>
              <p className="soft">
                Every project is different, so we take the time to understand yours.{" "}
                <Link href="/lending" className="link-strong">Learn about our lending</Link>
              </p>
              <div>
                <RoleLink role="Borrower" className="btn">Tell us about your project</RoleLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="section section-line">
        <div className="wrap stack gap-32">
          <h2 className="h2">How it works</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 48 }}>
            {howItWorks.map((flow) => (
              <div key={flow.title}>
                <div className="eyebrow">{flow.title}</div>
                <ol className="steps">
                  {flow.steps.map((s) => (
                    <li key={s.n}>
                      <span className="step-n">{s.n}</span>
                      <span className="stack">
                        <span className="bold">{s.title}</span>
                        <span className="muted">{s.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p className="muted">Still have questions? <Link href="/faqs" className="link-strong">Read our FAQs</Link></p>
        </div>
      </section>

      <section id="deals" className="section section-alt">
        <div className="wrap stack gap-32">
          <div className="row between">
            <h2 className="h2">Projects we have helped make happen</h2>
            <Link href="/settled-deals" className="link-strong link-block">View all settled deals</Link>
          </div>
          <div className="grid">
            {deals.map((d) => <DealCard key={d.amount + d.purpose} deal={d} />)}
          </div>
        </div>
      </section>

      <section id="directors" aria-label="A word from our directors" className="section">
        <div className="wrap split" style={{ alignItems: "stretch" }}>
          <div className="video" role="img" aria-label="Video placeholder: a two minute introduction from our directors">
            <Image src="/img/directors.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 560px" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
            <div className="video-shade" />
            
            <div className="video-cap">
              <div className="h3" style={{ color: "#fff" }}>Meet Luca, Lyle and Marc</div>
              <div className="small">A two minute introduction from our directors. <span className="placeholder" style={{ color: "var(--navy)" }}>[Video to be filmed]</span></div>
            </div>
          </div>
          <div className="stack gap-16">
            <div className="eyebrow">A word from our directors</div>
            <blockquote>&ldquo;We do things a little differently, and we are always happy to explain why.&rdquo;</blockquote>
            <div className="stack gap-12 soft">
              <p>People often ask us how we are able to offer what we do. The short answer is that we focus on what matters most to the people we work with.</p>
              <p>Our borrowers value speed and certainty. We run a lean business and are careful about the deals we take on, so more of that value can be shared with our investors. We also invest our own money alongside yours, so we are in it together.</p>
              <p>Every investment carries some risk, and we believe the best way to understand ours is to talk it through. We would love to sit down with you and show you how we work.</p>
            </div>
            <div><Link href="#contact" className="btn">Book a chat with us</Link></div>
            <div className="stack">
              {team.slice(0, 3).map((p) => (
                <div className="list-row" key={p.name}>
                  <span className="bold">{p.name}</span>
                  <span className="muted small">{p.role}</span>
                  <span className="muted small">{directorLine[p.name]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="section section-line">
        <div className="wrap stack gap-32">
          <div className="row between">
            <h2 className="h2">The people you will be working with</h2>
            <Link href="/about" className="link-strong link-block">More about us</Link>
          </div>
          <div className="team-grid">
            {team.map((p) => (
              <div className="person" key={p.name}>
                {p.photo ? (
                  <Image src={p.photo} alt={p.name} width={327} height={408} sizes="(max-width: 600px) 100vw, 280px" />
                ) : (
                  <div className="headshot placeholder">[Headshot]</div>
                )}
                <div className="h3">{p.name}</div>
                <div className="muted small">{p.role}</div>
                {p.note && <div className="tiny" style={{ color: "var(--gold-text)" }}>{p.note}</div>}
                <p className="soft small">{p.bio}</p>
                {p.points && p.points.length > 0 && (
                  <ul className="dots small">{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                )}
                <a href={p.li} target="_blank" rel="noopener noreferrer" className="link-strong link-block small">View on LinkedIn</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}

const homeBlurb: Record<string, string> = {
  "senior-secured-mortgage-fund": "Steady monthly income, secured by registered first mortgages.",
  "enhanced-yield-opportunity-mortgage-fund": "Higher income potential, for investors comfortable with more risk.",
  "liquidity-fund": "Regular income with access to your money on 30 days' notice.",
};

const directorLine: Record<string, string> = {
  "Luca Guerra": "Finalist, Commercial Broker of the Year, Australian Broking Awards 2025 and 2026",
  "Lyle Rohde": "Leads our client relationships and partnerships",
  "Marc-Arion Wan": "Legal, private equity and cross border transactions",
};
