import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import PageHero from "@/components/PageHero";
import RoleLink from "@/components/RoleLink";
import { partners } from "@/lib/content";

export const metadata: Metadata = { title: "Partner with us", description: "How referrals to Atlantis Private work." };

export default function PartnersPage() {
  return (
    <>
      <PageHero eyebrow="Partner with us" title="Know someone looking to invest or borrow?">
        We work closely with real estate agencies and other introducers, and we look after the people they refer to us as if they were our own clients.
      </PageHero>
      <section className="section">
        <div className="wrap stack gap-32">
          <h2 className="h2">How referrals work</h2>
          <div className="grid">
            {partners.map((s) => (
              <div className="stack gap-12" key={s.n}>
                <span className="step-n">{s.n}</span>
                <h3 className="h3">{s.title}</h3>
                <p className="soft">{s.text}</p>
              </div>
            ))}
          </div>
          <div><RoleLink role="Broker or partner" className="btn">Refer a client</RoleLink></div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
