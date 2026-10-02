import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { getEventById } from "@/lib/admin/events";
import { supabaseConfig } from "@/lib/supabase/session";
import AdminPageHeader, { SECONDARY_BUTTON } from "@/components/admin/AdminPageHeader";
import DeleteEventButton from "@/components/admin/DeleteEventButton";
import EventForm from "@/components/admin/EventForm";
import { oswald } from "@/components/ui/formStyles";

export const metadata: Metadata = { title: "Editar evento" };

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const event = await getEventById(supabase, id);
  if (!event) notFound();

  const { url, anonKey } = supabaseConfig();

  return (
    <>
      <AdminPageHeader
        eyebrow="Editar evento"
        title={event.title}
        actions={
          <>
            {event.isPublished && (
              <a
                href={`/eventos/${event.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className={SECONDARY_BUTTON}
                style={oswald}
              >
                Ver en el sitio ↗
              </a>
            )}
            <DeleteEventButton id={event.id} title={event.title} />
          </>
        }
      />
      <EventForm event={event} supabaseUrl={url} supabaseAnonKey={anonKey} />
    </>
  );
}
