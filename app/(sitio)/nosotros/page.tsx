import type { Metadata } from "next";
import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import { OFFERINGS } from "@/lib/offerings";

const description =
  "La historia de Liberty Walk, desde un pequeño lote en Nagoya en 1993 hasta su llegada oficial a México en 2026 de la mano de Ayala Premium.";

export const metadata: Metadata = {
  title: "Nosotros",
  description,
  alternates: { canonical: "/nosotros" },
  openGraph: {
    title: "Nosotros | Liberty Walk México",
    description,
    url: "/nosotros",
    images: [{ url: ASSETS.gallery3 }],
  },
};

// Hitos tomados de la historia oficial en libertywalk.co.jp/history.
const TIMELINE = [
  {
    year: "1993",
    text: "Wataru Kato funda Liberty Walk en Nagoya, Japón, en un lote donde solo cabían tres autos.",
  },
  {
    year: "2008",
    text: "Sale a la venta el LB★PERFORMANCE Lamborghini Murciélago.",
  },
  {
    year: "2012",
    text: "LB-WORKS presenta su Lamborghini Murciélago en SEMA Show, en Estados Unidos.",
  },
  {
    year: "2018",
    text: "Liberty Walk firma un contrato de diseño con Lamborghini y nace la línea lb★nation.",
  },
  {
    year: "2026",
    text: "Liberty Walk llega oficialmente a México de la mano de Ayala Premium.",
    highlight: true,
  },
];

const TEAM = [
  {
    initials: "OA",
    name: "Omar Ayala",
    role: "Director general de Liberty Walk México",
  },
  {
    initials: "GD",
    name: "Gonzalo Dávila",
    role: "Director de ventas de Liberty Walk México",
  },
  {
    initials: "VR",
    name: "Vladk Ruso",
    role: "Embajador oficial de la marca",
  },
];

const oswald: React.CSSProperties = { fontFamily: "var(--font-oswald), sans-serif" };
const barlow: React.CSSProperties = { fontFamily: "var(--font-barlow), sans-serif" };
const PAD = "px-15 md:px-20 lg:px-20 xl:px-40";

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className="mb-4 text-[16px] font-medium uppercase tracking-[3.2px] md:text-[18px] md:tracking-[3.6px]"
      style={{ ...oswald, color: light ? "var(--text-overlay)" : "var(--text-tertiary)" }}
    >
      {children}
    </p>
  );
}

export default function NosotrosPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[560px] w-full items-end overflow-hidden md:min-h-[78vh]" style={{ background: "#090908" }}>
        <img
          src={ASSETS.gallery3}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #090908 5%, rgba(9,9,8,0.55) 45%, rgba(9,9,8,0.25) 100%)" }}
        />
        <div className={`relative z-10 w-full ${PAD} pb-16 pt-[140px] md:pb-24`}>
          <p
            className="mb-4 flex items-center gap-2 text-[18px] font-medium tracking-[3.6px] md:text-[20px] md:tracking-[4px]"
            style={{ ...oswald, color: "var(--text-secondary-w)" }}
          >
            <span style={{ fontFamily: "var(--font-bebas), sans-serif" }}>★</span>
            NOSOTROS
          </p>
          <h1
            className="mb-6 text-[44px] font-medium uppercase leading-[1.05] md:text-[80px]"
            style={{ ...oswald, color: "var(--text-primary-w)" }}
          >
            Liberty Walk
            <br />
            llega a México
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed md:text-[20px]" style={{ ...barlow, color: "var(--text-secondary-w)" }}>
            De un pequeño lote en Nagoya a los autos más icónicos del mundo. Esta
            es la historia de cómo Liberty Walk llegó oficialmente a México.
          </p>
        </div>
      </section>

      {/* ── Origen ── */}
      <section className={`w-full ${PAD} py-16 md:py-24`} style={{ background: "var(--bg-surface)" }}>
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <div className="mx-auto aspect-square w-full max-w-[460px] overflow-hidden md:mx-0">
            <img src={ASSETS.wataruKato} alt="Wataru Kato, fundador de Liberty Walk" className="h-full w-full object-cover" />
          </div>
          <div>
            <Eyebrow>El origen</Eyebrow>
            <h2
              className="mb-6 text-[34px] font-medium uppercase leading-tight md:text-[48px]"
              style={{ ...oswald, color: "var(--text-primary)" }}
            >
              Una visión que nació en Nagoya
            </h2>
            <div className="flex max-w-2xl flex-col gap-5 text-[17px] leading-relaxed md:text-[18px]" style={{ ...barlow, color: "var(--text-secondary)" }}>
              <p>
                Liberty Walk fue fundada por Wataru Kato cuando tenía 26 años,
                operando desde un pequeño lote donde solo podían exhibir tres
                autos.
              </p>
              <p>
                Su estilo, con salpicaderas atornilladas, alerones enormes y autos
                exóticos a ras de piso, rompió las reglas de la personalización.
                Con el tiempo, la marca se convirtió en uno de los nombres más
                influyentes de la cultura automotriz mundial.
              </p>
            </div>
            <div className="mb-3 mt-8 h-[2px] w-[54px]" style={{ background: "var(--text-tertiary)" }} />
            <p className="text-[14px] uppercase tracking-[2px]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
              Est. 1993, Nagoya, Japón
            </p>
          </div>
        </div>
      </section>

      {/* ── Trayectoria ── */}
      <section className={`w-full ${PAD} py-16 md:py-24`} style={{ background: "var(--bg-surface-2)" }}>
        <Eyebrow>Trayectoria</Eyebrow>
        <h2
          className="mb-10 text-[34px] font-medium uppercase leading-tight md:mb-14 md:text-[48px]"
          style={{ ...oswald, color: "var(--text-primary)" }}
        >
          De Japón al mundo
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TIMELINE.map((item) => (
            <li
              key={item.year}
              className="flex flex-col gap-3 border-t-[3px] px-5 pb-6 pt-5"
              style={{
                borderColor: "var(--text-primary)",
                background: item.highlight ? "#090908" : "var(--bg-surface)",
              }}
            >
              <span
                className="text-[40px] font-medium leading-none md:text-[48px]"
                style={{ ...oswald, color: item.highlight ? "var(--text-primary-w)" : "var(--text-primary)" }}
              >
                {item.year}
              </span>
              <span
                className="text-[16px] leading-snug"
                style={{ ...barlow, color: item.highlight ? "var(--text-secondary-w)" : "var(--text-secondary)" }}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── El camino a México ── */}
      <section className={`w-full ${PAD} py-16 md:py-24`} style={{ background: "#090908" }}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          <div>
            <Eyebrow light>Liberty Walk México</Eyebrow>
            <h2
              className="mb-6 text-[34px] font-medium uppercase leading-tight md:text-[48px]"
              style={{ ...oswald, color: "var(--text-primary-w)" }}
            >
              El camino a México
            </h2>
            <div className="flex max-w-2xl flex-col gap-5 text-[17px] leading-relaxed md:text-[18px]" style={{ ...barlow, color: "var(--text-secondary-w)" }}>
              <p>
                México tiene una de las culturas automotrices más apasionadas del
                continente. Esa pasión, junto con el interés creciente por
                proyectos de personalización de alto nivel, hizo del país un
                mercado clave para Liberty Walk.
              </p>
              <p>
                Ayala Premium, con sede en Morelia, Michoacán, se convirtió en el
                distribuidor oficial de la marca en el país. El lunes 11 de mayo
                de 2026, en una rueda de prensa en la Ciudad de México, Liberty
                Walk anunció oficialmente su llegada.
              </p>
              <p>
                Desde entonces, los body kits FRP, CFRP y Dry Carbon llegan
                directo de Japón, con instalación profesional aquí en México.
              </p>
            </div>
            <Link
              href="/eventos"
              className="group mt-8 inline-flex items-center gap-2 text-[15px] font-medium uppercase tracking-[2px]"
              style={{ ...oswald, color: "var(--text-primary-w)" }}
            >
              <span className="relative pb-1">
                Ver eventos
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <figure className="flex flex-col justify-center border-l-[3px] pl-6 md:pl-10" style={{ borderColor: "rgba(255,255,255,0.6)" }}>
            <blockquote
              className="mb-6 text-[24px] font-light leading-snug md:text-[30px]"
              style={{ ...oswald, color: "var(--text-primary-w)" }}
            >
              “México representa un mercado clave para Liberty Walk por la pasión
              y el conocimiento que existe alrededor de la cultura automotriz.”
            </blockquote>
            <figcaption className="text-[15px] uppercase tracking-[2px]" style={{ ...barlow, color: "var(--text-overlay)" }}>
              Gonzalo Dávila, director de ventas
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Equipo ── */}
      <section className={`w-full ${PAD} py-16 md:py-24`} style={{ background: "var(--bg-surface)" }}>
        <Eyebrow>Equipo</Eyebrow>
        <h2
          className="mb-10 text-[34px] font-medium uppercase leading-tight md:mb-14 md:text-[48px]"
          style={{ ...oswald, color: "var(--text-primary)" }}
        >
          Quiénes lo hacen posible
        </h2>
        <ul className="grid gap-5 md:grid-cols-3 md:gap-6">
          {TEAM.map((person) => (
            <li
              key={person.name}
              className="flex items-center gap-5 border px-6 py-6"
              style={{ borderColor: "var(--border-default)", background: "var(--bg-surface)" }}
            >
              <span
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center text-[24px] font-medium"
                style={{ ...oswald, background: "#090908", color: "var(--text-primary-w)" }}
              >
                {person.initials}
              </span>
              <span>
                <span className="block text-[22px] font-medium leading-tight" style={{ ...oswald, color: "var(--text-primary)" }}>
                  {person.name}
                </span>
                <span className="block text-[15px] leading-snug" style={{ ...barlow, color: "var(--text-tertiary)" }}>
                  {person.role}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Qué ofrecemos ── */}
      <section className={`w-full ${PAD} pb-16 md:pb-24`} style={{ background: "var(--bg-surface)" }}>
        <Eyebrow>Qué ofrecemos</Eyebrow>
        <div className="flex flex-col md:flex-row">
          {OFFERINGS.map(({ title, description: text }, i) => (
            <div
              key={title}
              className={`flex flex-1 flex-col justify-center px-8 py-8 md:px-9 ${
                i < OFFERINGS.length - 1
                  ? "border-b border-b-[var(--border-default)] md:border-b-0 md:border-r md:border-r-[var(--border-default)]"
                  : ""
              }`}
              style={{ background: "var(--bg-surface-2)" }}
            >
              <div className="mb-4 h-[8px] w-[42px] md:mb-5 md:w-[50px]" style={{ background: "var(--text-primary)" }} />
              <p className="mb-2 text-[18px] font-medium" style={{ ...oswald, color: "var(--text-primary)" }}>
                {title}
              </p>
              <p className="w-full max-w-[280px] text-[16px] font-medium leading-snug" style={{ ...barlow, color: "var(--text-secondary)" }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cierre ── */}
      <section className="relative w-full overflow-hidden" style={{ background: "#090908" }}>
        <img
          src={ASSETS.gallery2}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className={`relative z-10 flex flex-col items-center ${PAD} py-20 text-center md:py-28`}>
          <h2
            className="mb-4 text-[34px] font-medium uppercase leading-tight md:text-[56px]"
            style={{ ...oswald, color: "var(--text-primary-w)" }}
          >
            ¿Listo para elevar tu auto?
          </h2>
          <p className="mb-8 text-[17px] md:mb-10 md:text-[20px]" style={{ ...barlow, color: "var(--text-secondary-w)" }}>
            Servicio y venta a todo México.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/body-kits"
              className="inline-flex h-12 items-center px-7 text-[15px] font-medium uppercase tracking-[1.5px] transition-opacity hover:opacity-85 md:h-14 md:px-9"
              style={{ ...oswald, background: "#fff", color: "var(--text-primary)" }}
            >
              Ver body kits
            </Link>
            <Link
              href="/#contacto"
              className="inline-flex h-12 items-center border px-7 text-[15px] font-medium uppercase tracking-[1.5px] text-white transition-colors hover:bg-white hover:text-black md:h-14 md:px-9"
              style={{ ...oswald, borderColor: "rgba(255,255,255,0.6)" }}
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
