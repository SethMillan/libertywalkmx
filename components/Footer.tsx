import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import { NAV_LINKS } from "@/lib/navigation";
import { InstagramIcon, MailIcon, PinIcon, TikTokIcon } from "@/components/icons";
import {
  CONTACT_EMAIL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  LBW_JAPAN_URL,
  TIKTOK_URL,
} from "@/lib/site";

// Concepto de footer (rama dev-footer-concept). Todo el contacto es por
// correo: no hay WhatsApp ni teléfono destacado.

// Cuando exista la página del aviso de privacidad, poner aquí su ruta
// (ej. "/aviso-de-privacidad") y el link aparece solo en la barra inferior.
const PRIVACY_NOTICE_URL: string | null = null;

const oswald: React.CSSProperties = { fontFamily: "var(--font-oswald), sans-serif" };
const barlow: React.CSSProperties = { fontFamily: "var(--font-barlow), sans-serif" };
const bebas: React.CSSProperties = { fontFamily: "var(--font-bebas), sans-serif" };

// En el footer los links del home ("#inicio", "#contacto") tienen que
// funcionar desde cualquier página.
function footerHref(href: string) {
  if (href === "#inicio") return "/";
  return href.startsWith("#") ? `/${href}` : href;
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mb-5 text-[13px] font-medium uppercase tracking-[3px]"
      style={{ ...oswald, color: "var(--text-overlay)" }}
    >
      {children}
    </p>
  );
}

const linkClass =
  "group inline-flex items-center gap-2 text-[16px] text-white/80 transition-colors duration-200 hover:text-white";

const SOCIALS = [
  { label: "Instagram", href: INSTAGRAM_URL, icon: <InstagramIcon /> },
  { label: "TikTok", href: TIKTOK_URL, icon: <TikTokIcon /> },
];

const LBW_LINKS = [
  { label: "Catálogo de body kits", href: "/body-kits", external: false },
  { label: "Liberty Walk Japón", href: LBW_JAPAN_URL, external: true },
  { label: "Distribuidores en el mundo", href: `${LBW_JAPAN_URL}/world-dealer/`, external: true },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative w-full overflow-hidden border-t"
      style={{ background: "#090908", borderColor: "rgba(255,255,255,0.12)" }}
    >
      <div className="px-15 md:px-20 lg:px-20 xl:px-40 pt-16 md:pt-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,3fr))] lg:gap-10">
          {/* Marca */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3" aria-label="Liberty Walk México, inicio">
              <img src={ASSETS.lbMxLogo} alt="" className="h-[56px] w-[56px] object-cover md:h-[64px] md:w-[64px]" />
              <span className="leading-none text-white" style={bebas}>
                <span className="block text-[22px] md:text-[24px]">LIBERTY WALK</span>
                <span className="block text-[15px] md:text-[16px]">MÉXICO</span>
              </span>
            </Link>
            <p
              className="mt-6 max-w-sm text-[16px] leading-relaxed text-white/80"
              style={barlow}
            >
              Distribuidor oficial de Liberty Walk en México. Body kits importados
              directo de Japón e instalados por Ayala Premium.
            </p>
            <ul className="mt-7 flex gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} Liberty Walk México`}
                    className="flex h-11 w-11 items-center justify-center border text-white transition-colors duration-200 hover:bg-white hover:text-black"
                    style={{ borderColor: "rgba(255,255,255,0.3)" }}
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navegación */}
          <nav aria-label="Navegación del pie de página">
            <ColumnTitle>Navegación</ColumnTitle>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={footerHref(href)}
                    className={`${linkClass} uppercase tracking-[1.5px]`}
                    style={oswald}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <ColumnTitle>Contacto</ColumnTitle>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`${linkClass} break-all`}
                  style={barlow}
                >
                  <MailIcon className="h-[18px] w-[18px] shrink-0" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} items-start`}
                  style={barlow}
                >
                  <PinIcon className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                  <span>
                    Ayala Premium
                    <br />
                    Av Solidaridad 165, Nueva Chapultepec,
                    <br />
                    58280 Morelia, Mich.
                  </span>
                </a>
              </li>
              <li>
                <Link
                  href="/#contacto"
                  className="mt-2 inline-flex h-11 items-center border px-5 text-[13px] font-medium uppercase tracking-[2px] text-white transition-colors duration-200 hover:bg-white hover:text-black"
                  style={{ ...oswald, borderColor: "rgba(255,255,255,0.5)" }}
                >
                  Solicitar cotización
                </Link>
              </li>
            </ul>
          </div>

          {/* Liberty Walk */}
          <div>
            <ColumnTitle>Liberty Walk</ColumnTitle>
            <ul className="flex flex-col gap-3">
              {LBW_LINKS.map(({ label, href, external }) => (
                <li key={label}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                      style={barlow}
                    >
                      {label}
                      <span aria-hidden="true" className="text-[13px] opacity-60 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <Link href={href} className={linkClass} style={barlow}>
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Marca de agua */}
      <p
        aria-hidden="true"
        className="pointer-events-none mt-14 select-none whitespace-nowrap px-4 text-center leading-[0.8] md:mt-20"
        style={{
          ...bebas,
          color: "rgba(255,255,255,0.07)",
          fontSize: "clamp(32px, 13vw, 230px)",
        }}
      >
        LIBERTY WALK MÉXICO
      </p>

      {/* Barra inferior */}
      <div
        className="relative border-t px-15 md:px-20 lg:px-20 xl:px-40 py-6"
        style={{ borderColor: "rgba(255,255,255,0.12)" }}
      >
        <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
          <p
            className="text-[12px] font-light uppercase tracking-[2px] md:text-[13px]"
            style={{ ...oswald, color: "var(--text-overlay)" }}
          >
            © {year} Liberty Walk México · Ayala Premium. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            {PRIVACY_NOTICE_URL && (
              <Link
                href={PRIVACY_NOTICE_URL}
                className="text-[12px] uppercase tracking-[2px] transition-colors hover:text-white md:text-[13px]"
                style={{ ...oswald, color: "var(--text-overlay)" }}
              >
                Aviso de privacidad
              </Link>
            )}
            <p
              className="text-[12px] uppercase tracking-[2px] md:text-[13px]"
              style={{ ...oswald, color: "var(--text-overlay)" }}
            >
              Distribuidor oficial
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
