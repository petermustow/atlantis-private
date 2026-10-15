import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Contact", description: "Talk to Atlantis Private about investing or borrowing." };

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <section className="section-sm">
        <div className="wrap grid-sm">
          {site.offices.map((o) => (
            <div className="stack gap-8" key={o.city}>
              <div className="h3">{o.city}</div>
              <div className="soft">{o.lines.map((l, i) => <span key={l}>{l}{i < o.lines.length - 1 && <br />}</span>)}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
