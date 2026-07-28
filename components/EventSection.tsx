"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ASSETS } from "@/lib/assets";

interface EventItem {
  icon: ReactNode;
  label: string;
  value: string;
}

const eventData: EventItem[] = [
  {
    icon: (
      <div className="relative h-[17px] w-[17px] md:h-[21px] md:w-[21px]">
        <div className="absolute inset-0 rounded-full border border-black flex items-center justify-center">
          <div className="h-[7px] w-[7px] rounded-full bg-black md:h-[9px] md:w-[9px]" />
        </div>
      </div>
    ),
    label: "UBICACIÓN",
    value: "Ciudad de México, CDMX",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[15px] h-[15px] md:w-[19px] md:h-[19px]"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "HORARIO",
    value: "12:00 PM",
  },
  {
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[20px] h-[20px] md:w-[26px] md:h-[26px]"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    label: "TIPO DE EVENTO",
    value: "Rueda de prensa",
  },
];

const infoCards = [
  {
    title: "BODY KITS",
    description:
      "Body kits completos de fibra que transforman la silueta de tu vehículo. FRP, CFRP y DRY CARBON disponibles.",
  },
  {
    title: "INSTALACIÓN PROFESIONAL",
    description:
      "Centro de servicio oficial certificado Ayala Premium. Garantía de calidad en cada proyecto.",
  },
  {
    title: "ENVÍO DIRECTO DE JAPÓN",
    description:
      "Importación directa desde Liberty Walk Japón en Nagoya. Piezas 100% originales.",
  },
];

export default function EventSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Si el navegador bloquea audio, reproducir silenciado
            video.muted = true;
            video.play();
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="evento"
      className="relative w-full pb-20"
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Header */}
      <div className="px-15 md:px-20 lg:px-20 xl:px-40 pt-[66px] md:pt-[97px]">
        {/* Parte superior */}
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 xl:gap-30 items-center">
          {/* Texto de la izquierda*/}
          <div className="flex-1 min-w-0 basis-0">
            <div
              className="flex items-center gap-2 text-[18px] md:text-[20px] font-medium tracking-[3.6px] md:tracking-[4px] capitalize mb-4 md:mb-6"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                color: "var(--text-tertiary)",
              }}
            >
              <span style={{ fontFamily: "var(--font-bebas), sans-serif" }}>
                ★
              </span>
              <span>MÁS SOBRE NOSOTROS</span>
            </div>

            <h2
              className="text-[40px] md:text-[60px] font-medium leading-tight uppercase mb-6 md:mb-8 w-full"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                color: "var(--text-primary)",
              }}
            >
              LIBERTY WALK
              <br />
              llega a México
            </h2>

            <p
              className="text-[clamp(16px,1.8vw,20px)] not-italic leading-relaxed mb-10 md:mb-14 w-full"
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                color: "var(--text-secondary)",
              }}
            >
              Por primera vez, los exclusivos body kits de Liberty Walk llegan oficialmente a
              México, marcando un antes y después para la cultura automotriz en
              nuestro país.
              <br />
              <br />
              México se suma oficialmente a la familia Liberty Walk,
              introduciendo al país una de las marcas más influyentes y
              reconocidas del mundo en personalización de alto nivel.
            </p>
            {/* LINEA DECORATIVA */}
            <div className="h-[6px] w-[20%] bg-black/70 mb-8" />
          </div>
          {/* Video  */}
          <div className="flex-1 min-w-0 basis-0 flex flex-col md:flex-row gap-6 md:gap-12">
            {/* Video Card */}
            <div
              className="relative overflow-hidden w-full"
              style={{ height: "565px" }}
            >
              <video
                ref={videoRef}
                src={ASSETS.videoLibertyWalk}
                loop
                controls
                playsInline
                className="w-full object-cover"
                style={{ height: "calc(100% + 45px)", marginTop: "-40px" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex flex-col md:flex-row mt-16 ">
          {[ASSETS.gallery1, ASSETS.gallery2, ASSETS.gallery3].map((src, i) => (
            <div
              key={i}
              className="w-full md:flex-1 md:min-w-0 overflow-hidden"
              style={{ height: "clamp(240px, 28vw, 320px)" }}
            >
              <img
                src={src}
                alt={`Galería ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Info cards */}
        <div className="flex flex-col md:flex-row mt-10 md:mt-[54px]">
          {infoCards.map(({ title, description }, i) => (
            <div
              key={title}
              className={`flex-1 flex flex-col justify-center px-8 md:px-9 py-8 ${
                i < infoCards.length - 1
                  ? "border-b border-b-[var(--border-default)] md:border-b-0 md:border-r md:border-r-[var(--border-default)]"
                  : ""
              }`}
              style={{
                background: "var(--bg-surface-2)",
              }}
            >
              <div
                className="w-[42px] md:w-[50px] h-[8px] mb-4 md:mb-5"
                style={{ background: "var(--text-primary)" }}
              />
              <p
                className="text-[18px] font-medium mb-2"
                style={{
                  fontFamily: "var(--font-oswald), sans-serif",
                  color: "var(--text-primary)",
                }}
              >
                {title}
              </p>
              <p
                className="text-[16px] not-italic leading-snug w-full max-w-[280px]"
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
