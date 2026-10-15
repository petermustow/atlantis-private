import type { MetadataRoute } from "next";

// Only the production site is indexable. Staging and previews ask crawlers to stay away
// (they are also behind Vercel login).
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] } };
}
