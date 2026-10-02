import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { supabaseConfig } from "@/lib/supabase/session";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import EventForm from "@/components/admin/EventForm";

export const metadata: Metadata = { title: "Nuevo evento" };

export default async function NewEventPage() {
  await requireAdmin();
  // La URL y la llave pública (no secreta) de Supabase, para subir fotos
  // desde el navegador con la sesión del encargado.
  const { url, anonKey } = supabaseConfig();

  return (
    <>
      <AdminPageHeader
        eyebrow="Eventos"
        title="Nuevo evento"
        description="Llena lo básico y publícalo cuando esté listo; mientras tanto se guarda como borrador."
      />
      <EventForm supabaseUrl={url} supabaseAnonKey={anonKey} />
    </>
  );
}
