"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ASSETS } from "@/lib/assets";
import { ADMIN_SECTIONS } from "@/lib/admin/sections";
import { signOut } from "@/app/admin/actions";
import { barlow, bebas, oswald } from "@/components/ui/formStyles";

// Marco del panel: menú lateral negro (como el footer del sitio) en
// escritorio; barra superior con menú desplegable en teléfono. Las secciones
// salen de lib/admin/sections.ts.

const NAV = [{ key: "inicio", label: "Inicio", href: "/admin" }, ...ADMIN_SECTIONS];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <aside
        className="z-40 flex w-full shrink-0 flex-col text-white lg:sticky lg:top-0 lg:h-screen lg:w-[264px]"
        style={{ background: "#090908" }}
      >
        <div className="flex items-center justify-between px-5 py-4 lg:px-7 lg:pb-8 lg:pt-8">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <img src={ASSETS.lbMxLogo} alt="" className="h-11 w-11 object-cover lg:h-12 lg:w-12" />
            <span className="leading-none" style={bebas}>
              <span className="block text-[20px]">LIBERTY WALK</span>
              <span className="block text-[13px] tracking-[1px] text-white/70">MÉXICO · ADMIN</span>
            </span>
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-white/30 lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
              <rect width="20" height="2" fill="white" />
              <rect y="6" width="20" height="2" fill="white" />
              <rect y="12" width="20" height="2" fill="white" />
            </svg>
          </button>
        </div>

        <div className={`${open ? "flex" : "hidden"} flex-1 flex-col border-t border-white/10 lg:flex lg:border-t-0`}>
          <nav aria-label="Secciones del panel" className="flex flex-col px-3 py-3 lg:px-4">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 border-l-2 px-4 py-3 text-[15px] font-medium uppercase tracking-[2px] transition-colors ${
                    active
                      ? "border-white bg-white/10 text-white"
                      : "border-transparent text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                  style={oswald}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-white/10 px-7 py-6">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] uppercase tracking-[2px] text-white/70 transition-colors hover:text-white"
              style={oswald}
            >
              Ver sitio ↗
            </a>
            {email && (
              <p className="text-[14px] text-white/50 [overflow-wrap:anywhere]" style={barlow}>
                {email}
              </p>
            )}
            <form action={signOut}>
              <button
                type="submit"
                className="h-10 w-full border border-white/30 text-[13px] font-medium uppercase tracking-[2px] text-white transition-colors hover:bg-white hover:text-black"
                style={oswald}
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
      </div>
    </div>
  );
}
