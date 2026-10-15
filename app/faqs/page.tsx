import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import Faq from "@/components/Faq";
import { faqs } from "@/lib/content";

export const metadata: Metadata = { title: "FAQs", description: "Questions you might have about investing or borrowing with Atlantis Private." };

export default function FaqsPage() {
  return (
    <>
      <section className="section">
        <div className="wrap narrow stack gap-32">
          <h1 className="h1-page">Questions you might have</h1>
          <Faq items={faqs} />
        </div>
      </section>
      <ContactSection />
    </>
  );
}
