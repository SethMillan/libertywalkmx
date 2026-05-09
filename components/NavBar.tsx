"use client";

import { useEffect, useState } from "react";
import { ASSETS } from "@/lib/assets";
import { slowScrollToHash } from "@/lib/scroll";

const NAV_LINKS = [
  { label: "INICIO", href: "#inicio" },
  { label: "NOSOTROS", href: "#nosotros" },
  { label: "EVENTO", href: "#evento" },
  { label: "BODY KITS", href: "#body-kits" },
  { label: "CONTACTO", href: "#contacto" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavigate =
    (href: string) =>
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      e.preventDefault();
      slowScrollToHash(href);
      setMenuOpen(false);
    };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-14 py-2.5 md:py-3 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <button
          onClick={handleNavigate("#inicio")}
          className="flex items-center gap-2 md:gap-3"
          aria-label="Ir al inicio"
        >
          <div className="w-[52px] h-[52px] md:w-[68px] md:h-[68px] shrink-0">
            <img
              src={ASSETS.lbMxLogo}
              alt="Liberty Walk México"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="text-white leading-none text-left"
            style={{ fontFamily: "var(--font-bebas), sans-serif" }}
          >
            <div className="text-lg md:text-xl">LIBERTY WALK</div>
            <div className="text-xs md:text-sm">MÉXICO</div>
          </div>
        </button>

        <ul
          className="hidden md:flex gap-8 text-white/80 text-[18px] font-medium list-none"
          style={{ fontFamily: "var(--font-oswald), sans-serif" }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                onClick={handleNavigate(href)}
                className="hover:text-white transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <rect y="0" width="28" height="2.5" rx="1.25" fill="white" />
            <rect y="8.75" width="28" height="2.5" rx="1.25" fill="white" />
            <rect y="17.5" width="28" height="2.5" rx="1.25" fill="white" />
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            x
          </button>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-white text-[32px] font-medium tracking-wider"
              style={{ fontFamily: "var(--font-oswald), sans-serif" }}
              onClick={handleNavigate(href)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
