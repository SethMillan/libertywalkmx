import Link from "next/link";
import { getCuratedHomeKits } from "@/lib/catalog";
import KitCard from "@/components/KitCard";

export default async function CatalogSection() {
  const kits = await getCuratedHomeKits();

  return (
    <section
      id="body-kits"
      className="relative w-full px-15 md:px-20 lg:px-20 xl:px-40 pb-20"
      style={{ background: "var(--bg-surface-2)" }}
    >
      <div className="pt-16.5 md:pt-24.25">
        <p
          className="text-[18px] md:text-[20px] font-medium tracking-[3.6px] md:tracking-[4px] capitalize mb-3 md:mb-4"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-tertiary)",
          }}
        >
          APLICACIÓN
        </p>
        <div className="mb-6 flex w-full items-center justify-between gap-4 md:mb-8">
          <h2
            className="text-[40px] md:text-[70px] font-medium leading-none"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-primary)",
            }}
          >
            BODY KITS
          </h2>
          <Link
            href="/body-kits"
            className="group inline-flex shrink-0 items-center gap-2 text-[14px] font-medium uppercase tracking-[2px] transition-colors duration-200 hover:text-(--text-primary) md:text-[16px]"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-tertiary)",
            }}
          >
            <span className="relative pb-1">
              Ver catálogo completo
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </span>
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {kits.length > 0 && (
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mb-12 md:gap-6 lg:grid-cols-3">
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
