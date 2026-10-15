import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import Newsletter from "@/components/Newsletter";
import PageHero from "@/components/PageHero";
import { insights } from "@/lib/content";

export const metadata: Metadata = { title: "Insights", description: "Fund updates, market commentary and news from our team." };

export default function InsightsPage() {
  return (
    <>
      <PageHero title="Insights">Fund updates, market commentary and news from our team.</PageHero>

      <section id="explainers" className="section-sm">
        <div className="wrap stack gap-24">
          <h2 className="h2-md">Private credit explained</h2>
          <div className="grid">
            {insights.explainers.map((e) => (
              <div className="card-flat" key={e.title}><span className="bold">{e.title}</span><span className="soft">{e.text}</span></div>
            ))}
          </div>
          <h2 className="h2-md" style={{ marginTop: 24 }}>Risks, defaults and your money</h2>
          <div className="grid">
            {insights.risks.map((r) => (
              <div className="card-flat" key={r.title}><span className="bold">{r.title}</span><span className="soft">{r.text}</span></div>
            ))}
          </div>
          <p className="small muted">General information only. It does not take into account your objectives, financial situation or needs.</p>
        </div>
      </section>

      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="wrap grid">
          {insights.posts.map((p, i) => (
            <div className="post" key={i}>
              <div className="post-img" />
              <span className="eyebrow">{p.tag}</span>
              <span className="bold placeholder" style={{ alignSelf: "flex-start", marginLeft: 20 }}>[Post title]</span>
              <span className="small muted placeholder" style={{ alignSelf: "flex-start", marginLeft: 20 }}>[Date]</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Newsletter" className="section-sm" style={{ paddingTop: 0 }}>
        <div className="wrap"><Newsletter /></div>
      </section>

      <ContactSection />
    </>
  );
}
