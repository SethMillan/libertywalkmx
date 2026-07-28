import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getKitDetail } from "@/lib/catalog";
import KitGallery from "@/components/KitGallery";
import OrderBuilder from "@/components/OrderBuilder";
import LocalDealerInfo from "@/components/LocalDealerInfo";

// Igual que en app/page.tsx: revalida en segundo plano cada hora para que un
// re-scrape se refleje sin necesitar redeploy manual.
export const revalidate = 3600;

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (id === null) return {};

  const kit = await getKitDetail(id);
  if (!kit) return {};

  const description = `Body kit ${kit.name} de ${kit.brand}${
    kit.productLine ? ` — línea ${kit.productLine}` : ""
  }. Disponible con Liberty Walk México, distribuidor oficial.`;
  const image = kit.imageHdUrl ?? kit.imageUrl ?? undefined;
  const title = `${kit.name} — Body Kit ${kit.brand}`;

  return {
    title,
    description,
    alternates: { canonical: `/body-kits/${id}` },
    openGraph: {
      title,
      description,
      url: `/body-kits/${id}`,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function kitJsonLd(id: number, kit: NonNullable<Awaited<ReturnType<typeof getKitDetail>>>) {
  const image = kit.imageHdUrl ?? kit.imageUrl;
  const allPrices = [...kit.completeItems, ...kit.singleParts]
    .flatMap((group) => group.variants)
    .map((v) => v.priceUsd)
    .filter((p): p is number => p != null);
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: kit.name,
    brand: { "@type": "Brand", name: kit.brand },
    image: image ? [image] : undefined,
    url: `https://libertywalk.com.mx/body-kits/${id}`,
    description: `Body kit ${kit.name} de ${kit.brand}${
      kit.productLine ? ` — línea ${kit.productLine}` : ""
    }, distribuido oficialmente en México por Liberty Walk México (Ayala Premium).`,
    ...(minPrice != null && {
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: minPrice,
        availability: "https://schema.org/InStock",
        url: `https://libertywalk.com.mx/body-kits/${id}`,
      },
    }),
  };
}

export default async function KitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = parseId(idParam);
  if (id === null) notFound();

  const kit = await getKitDetail(id);
  if (!kit) notFound();

  return (
    <section
      className="relative w-full px-15 md:px-20 lg:px-20 xl:px-40 pt-[120px] md:pt-[140px] pb-20"
      style={{ background: "var(--bg-surface)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kitJsonLd(id, kit)) }}
      />

      <KitGallery
        heroImage={kit.imageHdUrl ?? kit.imageUrl}
        images={kit.gallery}
        kitName={kit.name}
      />

      <div className="flex items-center gap-3 mt-8 mb-4 md:mt-10">
        <p
          className="text-[16px] md:text-[18px] font-medium uppercase tracking-[3px]"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-tertiary)",
          }}
        >
          {kit.brand}
          {kit.productLine ? ` · ${kit.productLine}` : ""}
        </p>
        {kit.isNew && (
          <span
            className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-[1.5px]"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              background: "var(--text-primary)",
              color: "var(--text-primary-w)",
            }}
          >
            NEW
          </span>
        )}
        {kit.badge && (
          <span
            className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-[1.5px]"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              background: "var(--text-primary)",
              color: "var(--text-primary-w)",
            }}
          >
            {kit.badge.label}
          </span>
        )}
      </div>

      <h1
        className="text-[32px] md:text-[48px] font-medium leading-tight mb-3"
        style={{
          fontFamily: "var(--font-oswald), sans-serif",
          color: "var(--text-primary)",
        }}
      >
        {kit.name}
      </h1>

      {kit.badge?.detail && (
        <p
          className="mb-4 text-[15px]"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            color: "var(--text-secondary)",
          }}
        >
          {kit.badge.detail}
        </p>
      )}

      <div className="h-[6px] w-[80px] bg-black/70 mb-8 md:mb-10" />

      <OrderBuilder
        kitName={kit.name}
        completeItems={kit.completeItems}
        singleParts={kit.singleParts}
      />

      <LocalDealerInfo />
    </section>
  );
}
