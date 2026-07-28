// Ayala Premium — dealer card. Réplica del diseño proporcionado (colores,
// tamaños, animaciones), con los íconos Font Awesome pasados a SVG inline
// (el sitio no carga Font Awesome).
const DC_BORDER = "#1a1a1a";
const DC_BLACK = "#101010";
// Todo el texto de la card usa el mismo negro (antes el renglón/dirección
// tenía un azul marino distinto al de los nombres/título).
const DC_TEXT = DC_BLACK;
const DC_WA = "#25d366";
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/6RNJxb57wUe6D5iZ7";

const poppins: React.CSSProperties = { fontFamily: "var(--font-poppins), sans-serif" };

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]">
      <path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Zm0-9.75A2.75 2.75 0 1 1 12 6.75a2.75 2.75 0 0 1 0 5.5Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]">
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01l-2.2 2.2Z" />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[15px] w-[15px]">
      <rect x="3" y="5" width="18" height="14" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 6.5 8 6.5 8-6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[19px] w-[19px]">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.34-.5.05-1.02.24-3.4-.71-2.88-1.15-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.37.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.29.38-.24.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.69-.17 1.37Z" />
    </svg>
  );
}

function DcRow({
  href,
  icon,
  children,
}: {
  href?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const className = "flex items-center justify-start gap-2.5 text-[15px] font-semibold no-underline my-2.5";
  const style: React.CSSProperties = { ...poppins, color: DC_TEXT };
  const inner = (
    <>
      <span className="flex w-[18px] shrink-0 items-center justify-center" style={{ color: DC_BLACK }}>
        {icon}
      </span>
      {children}
    </>
  );

  if (!href) {
    return (
      <div className={className} style={style}>
        {inner}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`${className} hover:underline`}
      style={style}
    >
      {inner}
    </a>
  );
}

export default function LocalDealerInfo() {
  return (
    <div className="mx-auto mt-14 max-w-[480px] md:mt-20" style={poppins}>
      <div
        className="bg-white px-8 pb-[26px] pt-[30px] max-[520px]:px-5 max-[520px]:pb-[22px] max-[520px]:pt-[26px]"
        style={{ border: `1.5px solid ${DC_BORDER}` }}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src="https://libertywalk.co.jp/wp-content/uploads/2026/02/Ayala-Premium.png"
            alt="Ayala Premium"
            className="mb-[30px] block h-auto max-w-[170px]"
          />
        </div>

        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex max-w-[360px] items-center justify-start gap-2.5 text-left hover:underline"
        >
          <span className="w-[18px] shrink-0" style={{ color: DC_BLACK }}>
            <PinIcon />
          </span>
          <span className="text-[15px] font-semibold" style={{ ...poppins, color: DC_TEXT }}>
            Av Solidaridad 165, Nueva Chapultepec, 58280 Morelia, Mich.
          </span>
        </a>

        <p className="mb-1 mt-[18px] text-[15px] font-bold" style={{ ...poppins, color: DC_BLACK }}>
          Gonzalo Dávila Harris
        </p>
        <DcRow href="tel:+529841698148" icon={<PhoneIcon />}>
          +52 984 169 8148
        </DcRow>
        <DcRow href="mailto:gonzalodh@libertywalk.com.mx" icon={<EnvelopeIcon />}>
          gonzalodh@libertywalk.com.mx
        </DcRow>

        <hr className="my-5 border-t" style={{ borderColor: "#e2e2e2" }} />

        <p className="mb-1 text-[15px] font-bold" style={{ ...poppins, color: DC_BLACK }}>
          Omar Ayala García
        </p>
        <DcRow href="tel:+524432090069" icon={<PhoneIcon />}>
          +52 443 209 0069
        </DcRow>
        <DcRow href="mailto:omarayala@libertywalk.com.mx" icon={<EnvelopeIcon />}>
          omarayala@libertywalk.com.mx
        </DcRow>

        <a
          href="https://wa.me/529841698148"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative isolate mt-[22px] flex w-full items-center justify-center gap-2.5 overflow-hidden border-[1.5px] border-[#101010] px-[18px] py-[13px] no-underline transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#128c4a] hover:shadow-[0_10px_22px_-10px_rgba(37,211,102,0.55)]"
          style={{ background: DC_BLACK, color: "#fff" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 z-0 origin-left scale-x-0 transition-transform duration-[350ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-x-100"
            style={{ background: DC_WA }}
          />
          <span className="relative z-[1] flex transition-transform duration-[350ms] ease-out group-hover:-rotate-6 group-hover:scale-[1.15]">
            <WhatsappIcon />
          </span>
          <span
            className="relative z-[1] text-[15px] font-bold uppercase tracking-[0.02em]"
            style={poppins}
          >
            WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
}
