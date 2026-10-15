import type { Metadata } from "next";
import ContactSection from "@/components/ContactSection";
import ReadinessCheck from "@/components/readiness/ReadinessCheck";
import "./readiness.css";

export const metadata: Metadata = {
  title: "Investor readiness check",
  description: "Eleven short questions to see how ready you are to invest, with a personal summary of the steps ahead.",
};

export default function ReadinessPage() {
  return (
    <>
      <ReadinessCheck />
      <ContactSection />
    </>
  );
}
