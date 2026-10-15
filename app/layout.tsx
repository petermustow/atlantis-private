import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/700.css";
import "./globals.css";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

const preview = process.env.VERCEL_ENV !== "production";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://atlantisprivate.com"),
  title: { default: "Atlantis Private", template: "%s | Atlantis Private" },
  description: "Lending, private credit and private equity, with offices in Melbourne and Singapore.",
  // Staging and previews are never indexed. Production is indexable.
  robots: preview ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#14213D" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <Ticker />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
