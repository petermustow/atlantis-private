import site from "@/content/site.json";
import ticker from "@/content/ticker.json";
import funds from "@/content/funds.json";
import team from "@/content/team.json";
import deals from "@/content/deals.json";
import lending from "@/content/lending.json";
import about from "@/content/about.json";
import fundExtras from "@/content/fund-extras.json";
import howItWorks from "@/content/how-it-works.json";
import pe from "@/content/pe.json";
import partners from "@/content/partners.json";
import insights from "@/content/insights.json";
import faqs from "@/content/faqs.json";
import complaints from "@/content/complaints.json";
import legal from "@/content/legal.json";

export type Fund = (typeof funds)[number];
export type Person = (typeof team)[number] & { photo?: string; note?: string; points?: string[] };

export {
  site, ticker, funds, team, deals, lending, about, fundExtras, howItWorks,
  pe, partners, insights, faqs, complaints, legal,
};

export const fundBySlug = (slug: string) => funds.find((f) => f.slug === slug);
