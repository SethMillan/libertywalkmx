"use client";

const brands = [
  "Ferrari",
  "Lamborghini",
  "McLaren",
  "Porsche",
  "Nissan",
  "BMW",
  "Mercedes",
  "Audi",
  "Toyota",
  "Ford",
  "Mazda",
  "Dodge",
  "Chevrolet",
  "Lexus",
  "Maserati",
  "Tesla",
  "Suzuki",
];

const cards = [
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

export default function MarcasSection() {
  const btnStyle: React.CSSProperties = {
    fontFamily: "var(--font-oswald), sans-serif",
    borderColor: "var(--bg-overlay)",
    color: "var(--text-tertiary)",
    boxShadow: "none",
  };

  return (
    <section
      id="body-kits"
      className="relative w-full px-15 md:px-20  lg:px-20 xl:px-40 pb-20"
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
          BODY KITS DISPONIBLES
        </p>
        <h2
          className="text-[40px] md:text-[70px] font-medium leading-none mb-6 md:mb-8"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-primary)",
          }}
        >
          MARCAS
        </h2>

        {/* Filter buttons – responsive chips */}
        <div className="mb-8 md:mb-10 flex max-w-180 flex-wrap justify-start gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              className="inline-flex h-10.5 w-fit shrink-0 items-center justify-center whitespace-nowrap border px-3 text-[16px] leading-none font-medium uppercase transition-all duration-200 hover:-translate-y-px hover:border-(--text-primary) hover:bg-[rgba(9,9,8,0.14)] hover:text-(--text-primary) hover:shadow-[0px_8px_18px_rgba(0,0,0,0.28)]"
              style={btnStyle}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Feature cards: stacked on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row">
        {cards.map(({ title, description }, i) => (
          <div
            key={title}
            className={`flex-1 flex flex-col justify-center px-6 sm:px-8 md:px-10 py-8 md:py-10 ${
              i < cards.length - 1
                ? "border-b border-b-(--border-default) md:border-b-0 md:border-r md:border-r-(--border-default)"
                : ""
            }`}
            style={{
              background: "var(--bg-surface)",
              borderTop: "1px solid var(--border-default)",
              minHeight: 220,
            }}
          >
            <span
              className="text-[20px] md:text-[24px] mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              ★
            </span>
            <p
              className="text-[22px] md:text-[24px] font-medium mb-3 w-full max-w-77.75"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                color: "var(--text-primary)",
              }}
            >
              {title}
            </p>
            <p
              className="text-[15px] md:text-[16px] not-italic leading-snug w-full max-w-59.5"
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                color: "var(--text-secondary)",
              }}
            >
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
