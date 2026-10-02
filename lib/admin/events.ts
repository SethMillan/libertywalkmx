import "server-only";
import {
  EVENT_COLUMNS,
  type EventRow,
  type SiteEvent,
  mapEvent,
  todayInMexico,
} from "@/lib/events";
import type { SessionClient } from "@/lib/supabase/session";

// Consultas del panel. A diferencia de lib/events.ts (solo publicados, llave
// pública), aquí se usa la sesión del encargado, así que también salen los
// borradores. Reutiliza el mismo mapeo y cálculo de estado que el sitio.

export type AdminEvent = SiteEvent & { isPublished: boolean; updatedAt: string };

const ADMIN_COLUMNS = `${EVENT_COLUMNS}, is_published, updated_at`;

type AdminRow = EventRow & { is_published: boolean; updated_at: string };

function mapAdminEvent(row: AdminRow, today: string): AdminEvent {
  return {
    ...mapEvent(row, today),
    isPublished: row.is_published,
    updatedAt: row.updated_at,
  };
}

// Todos los eventos, del más reciente al más antiguo (igual que /eventos).
export async function listAllEvents(supabase: SessionClient): Promise<AdminEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select(ADMIN_COLUMNS)
    .order("starts_on", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(`listAllEvents: ${error.message}`);
  const today = todayInMexico();
  return (data ?? []).map((row) => mapAdminEvent(row as AdminRow, today));
}

export async function getEventById(
  supabase: SessionClient,
  id: number,
): Promise<AdminEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .select(ADMIN_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`getEventById: ${error.message}`);
  return data ? mapAdminEvent(data as AdminRow, todayInMexico()) : null;
}
