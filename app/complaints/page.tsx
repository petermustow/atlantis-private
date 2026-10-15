import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import { complaints } from "@/lib/content";

export const metadata: Metadata = { title: "Making a complaint", description: "How to raise a concern with Atlantis Private, and how to reach AFCA." };

export default function ComplaintsPage() {
  return (
    <>
      <section className="section">
        <div className="wrap narrow stack gap-24">
          <h1 className="h1-page">Making a complaint</h1>
          <p className="lead">If something has not gone the way it should, we want to hear about it and put it right.</p>
          <ol className="steps">
            {complaints.map((c) => (
              <li key={c.n}>
                <span className="step-n">{c.n}</span>
                <span className="stack"><span className="bold">{c.title}</span><span className="soft">{c.text}</span></span>
              </li>
            ))}
          </ol>
          <div className="callout stack gap-8">
            <div className="h3">Australian Financial Complaints Authority (AFCA)</div>
            <div className="soft">
              Website: www.afca.org.au<br />Phone: 1800 931 678 (free call)<br />Email: info@afca.org.au<br />Mail: GPO Box 3, Melbourne VIC 3001
            </div>
            <div className="small placeholder" style={{ alignSelf: "flex-start" }}>[AFCA membership details to be confirmed with our licensee, Brindabella Investment Group.]</div>
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
