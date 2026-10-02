// Secciones del panel /admin. Para agregar una nueva (body kits, blog...):
//   1. Sumar una entrada aquí (aparece sola en el menú y en el inicio).
//   2. Crear su carpeta en app/admin/(panel)/<seccion>/ con sus páginas, y
//      llamar a requireAdmin() en cada página y acción del servidor.
//   3. Darle a sus tablas políticas RLS con public.is_admin() (ver
//      supabase/admin.sql como ejemplo).

export interface AdminSection {
  key: string;
  label: string;
  href: string;
  description: string;
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: "eventos",
    label: "Eventos",
    href: "/admin/eventos",
    description:
      "Agrega, edita y elimina los eventos que aparecen en /eventos y en el home.",
  },
];
