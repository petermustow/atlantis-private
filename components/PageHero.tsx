import type { ReactNode } from "react";

export default function PageHero({
  eyebrow,
  title,
  children,
  actions,
  narrow,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  narrow?: boolean;
}) {
  return (
    <section className="section-alt" style={{ borderBottom: "1px solid var(--line)" }}>
      <div className={`wrap${narrow ? " narrow" : ""}`} style={{ padding: "72px 24px" }}>
        <div className="stack gap-16" style={{ maxWidth: 760 }}>
          {eyebrow ? <div className="eyebrow">{eyebrow}</div> : <div className="rule" />}
          <h1 className="h1-page">{title}</h1>
          {children && <div className="lead">{children}</div>}
          {actions && <div className="row" style={{ marginTop: 8 }}>{actions}</div>}
        </div>
      </div>
    </section>
  );
}
