"use client";

import { useEffect, useMemo, useState } from "react";
import type { CatalogKit } from "@/lib/catalog";
import { LB_LINE_ICONS } from "@/lib/lbLineIcons";
import { BRAND_ICONS } from "@/lib/brandIcons";
import { brandPriorityIndex } from "@/lib/brandOrder";
import KitCard from "@/components/KitCard";

type ModalKey = "brand" | "line";

const pillBaseStyle: React.CSSProperties = {
  fontFamily: "var(--font-oswald), sans-serif",
  borderColor: "var(--bg-overlay)",
  color: "var(--text-tertiary)",
};

const pillActiveStyle: React.CSSProperties = {
  fontFamily: "var(--font-oswald), sans-serif",
  background: "var(--text-primary)",
  color: "var(--text-primary-w)",
  borderColor: "var(--text-primary)",
};

const pillClass =
  "inline-flex h-10.5 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap border px-3 text-[16px] leading-none font-medium uppercase transition-all duration-200 hover:-translate-y-px hover:border-(--text-primary) hover:shadow-[0px_8px_18px_rgba(0,0,0,0.28)]";

interface FilterOption {
  value: string;
  count: number;
}

function FilterModal({
  title,
  options,
  selected,
  onSelect,
  onClose,
  icons,
  wide,
  bannerIcons,
}: {
  title: string;
  options: FilterOption[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  onClose: () => void;
  icons?: Record<string, string>;
  wide?: boolean;
  // Los íconos de línea LB son banners rectangulares (logotipo + fondo
  // propio), no íconos cuadrados — necesitan su propio layout en fila
  // ancha en vez de la grilla de tarjeta cuadrada que usan las marcas.
  bannerIcons?: boolean;
}) {
  const withIcons = !!icons;
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(9, 9, 8, 0.65)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[80vh] w-full flex-col border ${wide ? "max-w-[976px]" : "max-w-2xl"}`}
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-default)" }}
      >
        <div
          className="flex items-center justify-between border-b px-5 py-4 md:px-6"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p
            className="text-[16px] font-medium uppercase tracking-[2px]"
            style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-primary)" }}
          >
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer text-[22px] leading-none transition-colors hover:text-(--text-primary)"
            style={{ color: "var(--text-tertiary)" }}
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-5 md:p-6">
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="mb-3 inline-flex h-10 cursor-pointer items-center border px-4 text-[14px] font-medium uppercase tracking-[0.5px] transition-colors hover:border-(--text-primary)"
            style={
              selected === null
                ? pillActiveStyle
                : { ...pillBaseStyle, borderColor: "var(--border-default)" }
            }
          >
            Todas
          </button>

          <div
            className={
              bannerIcons
                ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
                : withIcons
                  ? `grid grid-cols-2 gap-3 sm:grid-cols-3 ${wide ? "md:grid-cols-4" : ""}`
                  : "grid grid-cols-2 gap-2 sm:grid-cols-3"
            }
          >
            {options.map(({ value, count }) => {
              const isActive = value === selected;
              const icon = icons?.[value];

              if (bannerIcons) {
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onSelect(isActive ? null : value)}
                    className={`flex cursor-pointer items-center justify-between gap-3 border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "border-(--text-primary)"
                        : "border-(--border-default) hover:border-(--text-primary)"
                    }`}
                    style={{ background: isActive ? "var(--bg-surface-2)" : "transparent" }}
                  >
                    {icon ? (
                      // El banner ya trae su propio fondo y el nombre de la
                      // línea impreso — no hace falta repetir el texto.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={icon} alt={value} className="h-10 max-w-[70%] object-contain object-left" />
                    ) : (
                      <span
                        className="text-[14px] font-medium"
                        style={{
                          fontFamily: "var(--font-barlow), sans-serif",
                          color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                        }}
                      >
                        {value}
                      </span>
                    )}
                    <span
                      className="shrink-0 text-[12px]"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {count}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelect(isActive ? null : value)}
                  className={`flex cursor-pointer border px-3 py-3 text-left transition-colors ${
                    withIcons ? "flex-col items-center gap-2 text-center" : "items-center justify-between gap-2"
                  } ${
                    isActive
                      ? "border-(--text-primary)"
                      : "border-(--border-default) hover:border-(--text-primary)"
                  }`}
                  style={{ background: isActive ? "var(--bg-surface-2)" : "transparent" }}
                >
                  {withIcons && (
                    <span
                      className="flex h-12 w-12 items-center justify-center"
                      style={{ background: "var(--bg-surface-2)" }}
                    >
                      {icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={icon} alt="" className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <span
                          className="text-[18px] font-medium"
                          style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-tertiary)" }}
                        >
                          {value.charAt(0)}
                        </span>
                      )}
                    </span>
                  )}
                  <span className="flex flex-1 flex-col">
                    <span
                      className={withIcons ? "text-[13px] font-medium" : "truncate text-[14px] font-medium"}
                      style={{
                        fontFamily: "var(--font-barlow), sans-serif",
                        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {value}
                    </span>
                  </span>
                  <span
                    className="shrink-0 text-[12px]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogGrid({ kits }: { kits: CatalogKit[] }) {
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyLimited, setOnlyLimited] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<ModalKey | null>(null);
  const [query, setQuery] = useState("");

  const newCount = useMemo(() => kits.filter((k) => k.isNew).length, [kits]);
  const limitedCount = useMemo(() => kits.filter((k) => k.badge !== null).length, [kits]);

  const brandOptions = useMemo(() => {
    const counts = new Map<string, number>();
    kits.forEach((k) => counts.set(k.brand, (counts.get(k.brand) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => {
        const diff = brandPriorityIndex(a.value) - brandPriorityIndex(b.value);
        return diff !== 0 ? diff : a.value.localeCompare(b.value);
      });
  }, [kits]);

  const lineOptions = useMemo(() => {
    const counts = new Map<string, number>();
    kits.forEach((k) => {
      if (k.productLine && k.productLine !== "Sin línea") {
        counts.set(k.productLine, (counts.get(k.productLine) ?? 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, [kits]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return kits
      .filter((k) => {
        if (onlyNew && !k.isNew) return false;
        if (onlyLimited && k.badge === null) return false;
        if (selectedBrand && k.brand !== selectedBrand) return false;
        if (selectedLine && k.productLine !== selectedLine) return false;
        if (q && !k.name.toLowerCase().includes(q) && !k.brand.toLowerCase().includes(q))
          return false;
        return true;
      })
      .sort((a, b) => {
        const diff = brandPriorityIndex(a.brand) - brandPriorityIndex(b.brand);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });
  }, [kits, onlyNew, onlyLimited, selectedBrand, selectedLine, query]);

  const hasActiveFilters = onlyNew || onlyLimited || selectedBrand !== null || selectedLine !== null;

  return (
    <div>
      {/* Filtros + búsqueda */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 md:mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlyNew((v) => !v)}
            className={pillClass}
            style={onlyNew ? pillActiveStyle : pillBaseStyle}
          >
            Nuevo
            <span
              className="text-[12px]"
              style={{ color: onlyNew ? "var(--text-primary-w)" : "var(--text-tertiary)" }}
            >
              {newCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOnlyLimited((v) => !v)}
            className={pillClass}
            style={onlyLimited ? pillActiveStyle : pillBaseStyle}
          >
            Edición limitada
            <span
              className="text-[12px]"
              style={{ color: onlyLimited ? "var(--text-primary-w)" : "var(--text-tertiary)" }}
            >
              {limitedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpenModal("brand")}
            className={pillClass}
            style={selectedBrand ? pillActiveStyle : pillBaseStyle}
          >
            {selectedBrand ?? "Marcas"}
          </button>

          <button
            type="button"
            onClick={() => setOpenModal("line")}
            className={pillClass}
            style={selectedLine ? pillActiveStyle : pillBaseStyle}
          >
            {selectedLine ?? "Línea LB"}
          </button>
        </div>

        {/* Search */}
        <div className="group relative w-full max-w-md">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors duration-200 group-focus-within:text-(--text-primary)"
            style={{ color: "var(--text-tertiary)" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre o marca..."
            aria-label="Buscar body kit"
            className="w-full placeholder:opacity-60 focus:border-(--text-primary) transition-colors outline-none"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              fontSize: 16,
              color: "var(--text-primary)",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              padding: "12px 40px",
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center text-[18px] leading-none transition-colors hover:text-(--text-primary)"
              style={{ color: "var(--text-tertiary)" }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {openModal === "brand" && (
        <FilterModal
          title="Marcas"
          options={brandOptions}
          selected={selectedBrand}
          onSelect={(v) => {
            setSelectedBrand(v);
            setOpenModal(null);
          }}
          onClose={() => setOpenModal(null)}
          icons={BRAND_ICONS}
          wide
        />
      )}

      {openModal === "line" && (
        <FilterModal
          title="Línea LB"
          options={lineOptions}
          selected={selectedLine}
          onSelect={(v) => {
            setSelectedLine(v);
            setOpenModal(null);
          }}
          onClose={() => setOpenModal(null)}
          icons={LB_LINE_ICONS}
          bannerIcons
        />
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filtered.map((kit) => (
            <KitCard key={kit.id} kit={kit} hidePrice />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p
            className="mb-4 text-[16px]"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-tertiary)",
            }}
          >
            No encontramos kits que coincidan con los filtros seleccionados.
          </p>
          {(hasActiveFilters || query) && (
            <button
              type="button"
              onClick={() => {
                setOnlyNew(false);
                setOnlyLimited(false);
                setSelectedBrand(null);
                setSelectedLine(null);
                setQuery("");
              }}
              className="cursor-pointer text-[14px] font-medium uppercase tracking-[0.5px] underline underline-offset-4 transition-colors hover:text-(--text-primary)"
              style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-primary)" }}
            >
              Limpiar filtros y búsqueda
            </button>
          )}
        </div>
      )}
    </div>
  );
}
