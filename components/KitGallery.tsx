"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface KitGalleryProps {
  heroImage: string | null;
  images: { slideIndex: number; imageUrl: string; alt: string | null }[];
  kitName: string;
}

const FALLBACK_IMG = "/logo.png";

export default function KitGallery({ heroImage, images, kitName }: KitGalleryProps) {
  const allImages = Array.from(
    new Set(
      [heroImage, ...images.map((i) => i.imageUrl)].filter(
        (url): url is string => !!url,
      ),
    ),
  );

  const [current, setCurrent] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = allImages[current] ?? FALLBACK_IMG;
  const hasMultiple = allImages.length > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!hasMultiple) return;
      const next = ((index % allImages.length) + allImages.length) % allImages.length;
      setCurrent(next);
      thumbRefs.current[next]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [allImages.length, hasMultiple],
  );

  // Flechas del teclado — solo tiene sentido si hay más de una imagen.
  useEffect(() => {
    if (!hasMultiple) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo, hasMultiple]);

  if (allImages.length === 0) {
    return (
      <div
        className="flex h-[320px] md:h-[480px] w-full items-center justify-center"
        style={{ background: "var(--bg-surface-2)" }}
      >
        <img src={FALLBACK_IMG} alt={kitName} className="h-24 w-24 opacity-40" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="group relative w-full overflow-hidden"
        style={{ height: "clamp(280px, 46vw, 520px)", background: "var(--bg-surface-2)" }}
      >
        <img
          src={active}
          alt={kitName}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              aria-label="Imagen anterior"
              className="absolute inset-y-0 left-0 flex w-14 items-center justify-center text-white opacity-0 transition-opacity duration-200 hover:bg-black/25 group-hover:opacity-100 md:w-20"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 md:h-8 md:w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 19 8 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              aria-label="Imagen siguiente"
              className="absolute inset-y-0 right-0 flex w-14 items-center justify-center text-white opacity-0 transition-opacity duration-200 hover:bg-black/25 group-hover:opacity-100 md:w-20"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 md:h-8 md:w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <span
              className="absolute bottom-3 right-3 px-2.5 py-1 text-[12px] font-medium tracking-[1px] text-white"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                background: "rgba(0,0,0,0.6)",
              }}
            >
              {current + 1} / {allImages.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-2">
          {allImages.map((url, i) => {
            const isActive = i === current;
            return (
              <button
                key={`${url}-${i}`}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                onClick={() => goTo(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className="relative shrink-0 overflow-hidden border-2 transition-all duration-200"
                style={{
                  width: 84,
                  height: 60,
                  borderColor: isActive ? "var(--text-primary)" : "transparent",
                  opacity: isActive ? 1 : 0.55,
                }}
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
