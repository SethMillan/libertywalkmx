// Links principales del sitio (navbar y footer). Los que empiezan con "#" son
// secciones del home; el resto son páginas.
export const NAV_LINKS = [
  { label: "INICIO", href: "#inicio" },
  { label: "NOSOTROS", href: "/nosotros" },
  { label: "EVENTOS", href: "/eventos" },
  { label: "BODY KITS", href: "/body-kits" },
  { label: "CONTACTO", href: "#contacto" },
];

export function isActiveRoute(pathname: string, href: string) {
  return !href.startsWith("#") && (pathname === href || pathname.startsWith(`${href}/`));
}
