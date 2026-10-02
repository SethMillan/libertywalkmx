import { requireAdmin } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";

// Las páginas del panel siempre se generan por request (dependen de la sesión).
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Aquí solo se usa para mostrar el correo en el menú: cada página y acción
  // vuelve a llamar a requireAdmin() (el layout no se re-ejecuta al navegar).
  const { user } = await requireAdmin();
  return <AdminShell email={user.email}>{children}</AdminShell>;
}
