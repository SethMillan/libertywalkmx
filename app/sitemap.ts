import type { MetadataRoute } from "next";
import { getCatalogKits } from "@/lib/catalog";
import { getEvents } from "@/lib/events";

const SITE_URL = "https://libertywalk.com.mx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [kits, events] = await Promise.all([getCatalogKits(), getEvents()]);

  const kitUrls: MetadataRoute.Sitemap = kits.map((kit) => ({
    url: `${SITE_URL}/body-kits/${kit.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/eventos/${event.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
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
    {
      url: `${SITE_URL}/eventos`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/nosotros`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...kitUrls,
    ...eventUrls,
  ];
}
