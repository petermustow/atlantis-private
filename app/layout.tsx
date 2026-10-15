import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Ticker from "@/components/Ticker";
import Footer from "@/components/Footer";

// Self-hosted Latin subsets (SIL Open Font License, see app/fonts/README.md). next/font preloads
// them and matches the fallback font's metrics so text does not jump when they arrive.
const manrope = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-manrope",
  adjustFontFallback: "Arial",
});
const cormorant = localFont({
  src: "./fonts/cormorant-garamond-latin-600-normal.woff2",
  weight: "600",
  display: "swap",
  variable: "--font-cormorant",
  adjustFontFallback: "Times New Roman",
});
const cinzel = localFont({
  src: "./fonts/cinzel-latin-700-normal.woff2",
  weight: "700",
  display: "swap",
  variable: "--font-cinzel",
  adjustFontFallback: "Times New Roman",
});

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
    <html lang="en-AU" className={`${manrope.variable} ${cormorant.variable} ${cinzel.variable}`}>
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
