import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { legal } from "@/lib/content";

export const metadata: Metadata = { title: "Terms and Conditions" };
export default function TermsPage() {
  return <LegalPage doc={legal.terms} />;
}
