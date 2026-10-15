import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import DealCard from "@/components/DealCard";
import PageHero from "@/components/PageHero";
import RoleLink from "@/components/RoleLink";
import { deals } from "@/lib/content";

export const metadata: Metadata = { title: "Settled deals", description: "Projects Atlantis Private has helped to settlement." };

export default function DealsPage() {
  return (
    <>
      <PageHero eyebrow="Lending" title="Projects we have helped make happen">
        Every deal here is a real loan we have settled. Details are shared without identifying our borrowers.
      </PageHero>
      <section className="section">
        <div className="wrap grid">
          {deals.map((d) => <DealCard key={d.amount + d.purpose} deal={d} />)}
        </div>
        <div className="wrap row between" style={{ marginTop: 48 }}>
          <div className="h3">Could your project be next?</div>
          <RoleLink role="Borrower" className="btn">Tell us about your project</RoleLink>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
