import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atlantis Private",
  description: "Lending, private credit and private equity.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
