"use client";

import Link from "next/link";
import type { CatalogKit } from "@/lib/catalog";
import { formatUsdReference } from "@/lib/format";

export default function KitCard({
  kit,
  hidePrice,
}: {
  kit: CatalogKit;
  hidePrice?: boolean;
}) {
  return (
    <Link
      href={`/body-kits/${kit.id}`}
      className="group flex flex-col overflow-hidden border border-(--border-default) transition-all duration-300 ease-out hover:-rotate-1 hover:scale-[1.02] hover:border-(--text-primary) hover:shadow-[0_18px_34px_rgba(9,9,8,0.25)]"
      style={{ background: "var(--bg-surface)" }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "220px", background: "var(--bg-surface-2)" }}
      >
        {kit.imageUrl ? (
          <img
            src={kit.imageUrl}
            alt={kit.name}
            loading="lazy"
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              kit.isSoldOut ? "grayscale" : ""
            }`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/logo.png";
              e.currentTarget.className = "h-full w-full object-contain p-10 opacity-40";
            }}
          />
        ) : null}

        {(kit.isNew || kit.badge) && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
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
        )}

        {kit.isSoldOut && (
          <div
            className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center py-2"
            style={{ background: "#c0392b" }}
          >
            <span
              className="text-[15px] font-medium uppercase tracking-[3px] text-white"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
            >
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 py-4">
        <p
          className="mb-1 text-[13px] font-medium uppercase tracking-[2px]"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-tertiary)",
          }}
        >
          {kit.brand}
          {kit.productLine ? ` · ${kit.productLine}` : ""}
        </p>
        <p
          className="mb-3 text-[19px] font-medium leading-snug"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-primary)",
          }}
        >
          {kit.name}
        </p>
        {!kit.isSoldOut && !hidePrice && (
          <div className="mt-auto">
            {kit.startingPriceUsd != null ? (
              <p
                className="text-[16px] font-medium"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                Desde {formatUsdReference(kit.startingPriceUsd)}
              </p>
            ) : (
              <p
                className="text-[16px] font-medium"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                Precio a cotizar
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
