import type { MetadataRoute } from "next";
import { getCatalogKits } from "@/lib/catalog";

const SITE_URL = "https://libertywalk.com.mx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kits = await getCatalogKits();

  const kitUrls: MetadataRoute.Sitemap = kits.map((kit) => ({
    url: `${SITE_URL}/body-kits/${kit.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/body-kits`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...kitUrls,
  ];
}
