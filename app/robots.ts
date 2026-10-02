import type { MetadataRoute } from "next";

const SITE_URL = "https://libertywalk.com.mx";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel privado no se indexa (además lleva noindex en sus páginas).
      disallow: "/admin",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
