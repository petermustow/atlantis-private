import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { legal } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy Policy" };
export default function PrivacyPage() {
  return <LegalPage doc={legal.privacy} />;
}
