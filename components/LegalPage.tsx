import { site } from "@/lib/content";

type Doc = { title: string; note: string; intro: string; sections: { h: string; t: string }[] };

export default function LegalPage({ doc }: { doc: Doc }) {
  return (
    <section className="section">
      <div className="wrap narrow stack gap-24">
        <h1 className="h1-page">{doc.title}</h1>
        <p className="lead">{doc.intro}</p>
        <div className="callout small placeholder">{doc.note}</div>
        <div className="stack gap-24">
          {doc.sections.map((s) => (
            <div className="stack gap-8" key={s.h}>
              <h2 className="h2-sm">{s.h}</h2>
              <p className="soft">{s.t}</p>
            </div>
          ))}
        </div>
        <p className="small muted">
          Last updated <span className="placeholder">[date]</span>. Questions about this page can be sent to {site.email}.
        </p>
      </div>
    </section>
  );
}
