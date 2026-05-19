import { ReactNode } from "react";
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
  { title: "CAMPO MARTE", description: "Terraza Superior" },
  {
    title: "AUTOS EN EXHIBICIÓN",
    description: "Los builds más icónicos de LBWK por primera vez en México",
  },
  {
    title: "EXPERIENCIA INMERSIVA",
    description:
      "Conoce de cerca cada detalle del proceso de transformación Liberty Walk",
  },
];

export default function EventSection() {
  return (
    <section
      id="evento"
      className="relative w-full pb-20"
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Header */}
      <div className="px-15 md:px-40 pt-[66px] md:pt-[97px]">
        <div
          className="flex items-center gap-2 text-[18px] md:text-[20px] font-medium tracking-[3.6px] md:tracking-[4px] capitalize mb-4 md:mb-6"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-tertiary)",
          }}
        >
          <span style={{ fontFamily: "var(--font-bebas), sans-serif" }}>★</span>
          <span>PROXIMO EVENTO</span>
        </div>

        <h2
          className="text-[40px] md:text-[60px] font-medium leading-tight uppercase mb-6 md:mb-8 w-full md:w-[610px]"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-primary)",
          }}
        >
          LIBETY WALK
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
          Por primera vez en la historia, Liberty Walk presenta un evento
          exclusivo en territorio mexicano. Una experiencia inmersiva donde la
          cultura automotriz japonesa se encuentra con la pasión mexicana.
        </p>

        {/* Event panels */}
        <div className="grid grid-cols-1 md:[grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] items-stretch gap-6 md:gap-8 xl:gap-12">
          {/* Date/details box */}
          <div
            className="relative overflow-hidden bg-white shadow-[0_18px_60px_rgba(9,9,8,0.14)]"
            style={{ minHeight: "clamp(320px, 40vw, 500px)" }}
          >
            <div
              className="h-2 w-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(9,9,8,1) 0%, rgba(9,9,8,0.7) 58%, rgba(9,9,8,0.15) 100%)",
              }}
            />
            <div className="flex h-full flex-col px-5 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6 xl:px-10 xl:pb-10 xl:pt-8">
              <div
                className="pb-5 md:pb-6"
                style={{ borderColor: "var(--border-default)" }}
              >
                <p
                  className="text-[14px] font-medium uppercase tracking-[2.8px] md:text-[15px]"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    color: "var(--text-secondary)",
                  }}
                >
                  PRESENTACION EXCLUSIVA
                </p>
                <p
                  className="mt-2 font-medium leading-none"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    color: "var(--text-primary)",
                    fontSize: "clamp(62px, 11vw, 90px)",
                  }}
                >
                  11 MAY
                </p>
                <p
                  className="font-medium uppercase leading-none"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    color: "var(--text-secondary)",
                    fontSize: "clamp(28px, 5.8vw, 52px)",
                  }}
                >
                  lunes 2026
                </p>
              </div>

              <div className="mt-2 md:mt-3 flex flex-col">
                {eventData.map(({ icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 py-3.5 md:gap-5 md:py-4"
                  >
                    <div className="mt-1 flex w-8 md:w-9 shrink-0 items-center justify-center">
                      {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[14px] font-medium uppercase tracking-[1.8px] md:text-[15px]"
                        style={{
                          fontFamily: "var(--font-oswald), sans-serif",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {label}
                      </p>
                      <p
                        className="mt-1 block w-full border-b-[0.5px] border-black/30 pb-1 text-[16px] not-italic md:text-[17px]"
                        style={{
                          fontFamily: "var(--font-barlow), sans-serif",
                          fontWeight: 400,
                          color: "rgba(9,9,8,0.9)",
                        }}
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event photo */}
          <div
            className="relative overflow-hidden"
            style={{ minHeight: "clamp(320px, 42vw, 520px)" }}
          >
            <img
              src={ASSETS.eventPhoto}
              alt="Evento Liberty Walk México"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
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
