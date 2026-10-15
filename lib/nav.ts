export type NavItem = { label: string; desc: string; href: string };
export type NavMenu = { label: string; items: NavItem[] };

export const menus: NavMenu[] = [
  {
    label: "Invest",
    items: [
      { label: "Our funds", desc: "Three funds for different goals", href: "/funds" },
      { label: "Readiness check", desc: "See how ready you are to invest", href: "/readiness-check" },
      { label: "Private equity", desc: "Our private equity fund", href: "/private-equity" },
    ],
  },
  {
    label: "Lending",
    items: [
      { label: "What we lend for", desc: "Commercial property and corporate finance", href: "/lending" },
      { label: "Settled deals", desc: "Projects we have helped make happen", href: "/settled-deals" },
    ],
  },
  {
    label: "About",
    items: [
      { label: "Our story", desc: "Melbourne and Singapore", href: "/about" },
      { label: "Our team", desc: "The people you will be working with", href: "/#team" },
      { label: "What our clients say", desc: "In their own words", href: "/about#testimonials" },
      { label: "Partner with us", desc: "Refer a client to us", href: "/partners" },
      { label: "FAQs", desc: "Questions you might have", href: "/faqs" },
      { label: "How we are governed", desc: "The rules we hold ourselves to", href: "/about#governance" },
      { label: "Making a complaint", desc: "How to raise a concern", href: "/complaints" },
    ],
  },
];

export const footerLinks = {
  left: [
    { label: "Home", href: "/" },
    { label: "Our funds", href: "/funds" },
    { label: "Lending", href: "/lending" },
    { label: "Settled deals", href: "/settled-deals" },
    { label: "Private equity", href: "/private-equity" },
    { label: "Our story", href: "/about" },
    { label: "Partner with us", href: "/partners" },
  ],
  right: [
    { label: "Insights", href: "/insights" },
    { label: "FAQs", href: "/faqs" },
    { label: "Contact", href: "/contact" },
  ],
};
