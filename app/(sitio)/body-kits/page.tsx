import type { Metadata } from "next";
import { getCatalogKits } from "@/lib/catalog";
import CatalogGrid from "@/components/CatalogGrid";

// Igual que en app/page.tsx: revalida en segundo plano cada hora para que un
// re-scrape se refleje sin necesitar redeploy manual.
export const revalidate = 3600;

const description =
  "Explora todo el catálogo de body kits Liberty Walk disponibles en México: FRP, CFRP y DRY CARBON para Lamborghini, Ferrari, McLaren, Porsche, Nissan y más, importados directo de Japón.";

export const metadata: Metadata = {
  title: "Catálogo de Body Kits",
  description,
  alternates: { canonical: "/body-kits" },
  openGraph: {
    title: "Catálogo de Body Kits | Liberty Walk México",
    description,
    url: "/body-kits",
  },
};

export default async function BodyKitsPage() {
  const kits = await getCatalogKits();

  return (
    <section
      className="relative w-full px-15 md:px-20 lg:px-20 xl:px-40 pt-[120px] md:pt-[140px] pb-20"
      style={{ background: "var(--bg-surface-2)" }}
    >
      {/* Visualmente no hay título en esta página (decisión de diseño), pero
          la página necesita un h1 para SEO/accesibilidad. */}
      <h1 className="sr-only">Catálogo de Body Kits Liberty Walk México</h1>
      <CatalogGrid kits={kits} />
    </section>
  );
}
