import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import PageHero from "@/components/PageHero";
import { pe } from "@/lib/content";

export const metadata: Metadata = { title: "Private equity", description: "The Atlantis Private private equity fund." };

export default function PrivateEquityPage() {
  return (
    <>
      <PageHero eyebrow="Invest" title="Private equity">
        <span className="placeholder">[A short, warm introduction to our private equity fund and who it is for. Wording to be confirmed with compliance.]</span>
      </PageHero>
      <section className="section">
        <div className="wrap grid">
          {pe.map((pt) => (
            <div className="stack gap-12" key={pt.title}>
              <div className="accent" />
              <h3 className="h3"><span className="placeholder">{pt.title}</span></h3>
              <p className="soft"><span className="placeholder">{pt.text}</span></p>
            </div>
          ))}
        </div>
      </section>
      <ContactSection />
    </>
  );
}
