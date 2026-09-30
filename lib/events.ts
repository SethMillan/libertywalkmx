import { cache } from "react";
import { supabase } from "@/lib/supabase";

// Eventos de Liberty Walk México (tabla `events`, ver supabase/events.sql y
// DATABASE.md). El sitio solo lee eventos publicados. Si un evento es
// próximo, en curso o pasado NO se guarda en la base: se calcula aquí con la
// fecha de hoy en CDMX, así nadie tiene que mover eventos a mano.

export type EventStatus = "upcoming" | "ongoing" | "past";

export interface SiteEvent {
  id: number;
  slug: string;
  title: string;
  eventType: string | null;
  startsOn: string; // YYYY-MM-DD
  endsOn: string | null; // YYYY-MM-DD, solo si dura varios días
  timeLabel: string | null;
  venue: string | null;
  city: string;
  address: string | null;
  mapsUrl: string | null;
  summary: string | null;
  description: string | null;
  coverUrl: string | null;
  galleryUrls: string[];
  videoUrl: string | null;
  externalUrl: string | null;
  featuredOnHome: boolean;
  status: EventStatus;
}

const EVENT_COLUMNS =
  "id, slug, title, event_type, starts_on, ends_on, time_label, venue, city, address, maps_url, summary, description, cover_url, gallery_urls, video_url, external_url, featured_on_home";

type EventRow = {
  id: number;
  slug: string;
  title: string;
  event_type: string | null;
  starts_on: string;
  ends_on: string | null;
  time_label: string | null;
  venue: string | null;
  city: string;
  address: string | null;
  maps_url: string | null;
  summary: string | null;
  description: string | null;
  cover_url: string | null;
  gallery_urls: string[] | null;
  video_url: string | null;
  external_url: string | null;
  featured_on_home: boolean;
};

// Fecha de hoy en la Ciudad de México, como YYYY-MM-DD (comparable como texto
// contra las columnas `date` de Postgres).
export function todayInMexico(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getEventStatus(
  startsOn: string,
  endsOn: string | null,
  today = todayInMexico(),
): EventStatus {
  if (today < startsOn) return "upcoming";
  if (today <= (endsOn ?? startsOn)) return "ongoing";
  return "past";
}

export function isLive(status: EventStatus): boolean {
  return status !== "past";
}

function mapEvent(row: EventRow, today: string): SiteEvent {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    eventType: row.event_type,
    startsOn: row.starts_on,
    endsOn: row.ends_on,
    timeLabel: row.time_label,
    venue: row.venue,
    city: row.city,
    address: row.address,
    mapsUrl: row.maps_url,
    summary: row.summary,
    description: row.description,
    coverUrl: row.cover_url,
    galleryUrls: row.gallery_urls ?? [],
    videoUrl: row.video_url,
    externalUrl: row.external_url,
    featuredOnHome: row.featured_on_home,
    status: getEventStatus(row.starts_on, row.ends_on, today),
  };
}

// Si la tabla todavía no existe (falta correr supabase/events.sql) o Supabase
// falla, el sitio sigue funcionando: la sección de eventos queda vacía y el
// home muestra el video de lanzamiento.
function logEventsError(fn: string, message: string) {
  console.error(
    `[events] ${fn}: ${message}. ¿Ya se corrió supabase/events.sql en Supabase?`,
  );
}

// Todos los eventos publicados, del más reciente al más antiguo. Los próximos
// quedan arriba de forma natural porque su fecha es la más nueva.
export const getEvents = cache(async (): Promise<SiteEvent[]> => {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("is_published", true)
    .order("starts_on", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    logEventsError("getEvents", error.message);
    return [];
  }

  const today = todayInMexico();
  return (data ?? []).map((row) => mapEvent(row as EventRow, today));
});

export const getEventBySlug = cache(
  async (slug: string): Promise<SiteEvent | null> => {
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("is_published", true)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      logEventsError("getEventBySlug", error.message);
      return null;
    }
    return data ? mapEvent(data as EventRow, todayInMexico()) : null;
  },
);

// Home: si hay un evento marcado con `featured_on_home`, el home lo muestra
// en lugar del video de lanzamiento. Si no hay ninguno, se queda el video.
export async function getHomeFeaturedEvent(): Promise<SiteEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("is_published", true)
    .eq("featured_on_home", true)
    .order("starts_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logEventsError("getHomeFeaturedEvent", error.message);
    return null;
  }
  return data ? mapEvent(data as EventRow, todayInMexico()) : null;
}

// ---------- Formato de fechas ----------

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function parseDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

// "11 de mayo de 2026", "10 al 12 de octubre de 2026",
// "30 de septiembre al 2 de octubre de 2026"...
export function formatEventDate(startsOn: string, endsOn: string | null): string {
  const s = parseDate(startsOn);
  if (!endsOn || endsOn === startsOn) {
    return `${s.day} de ${MONTHS[s.month - 1]} de ${s.year}`;
  }
  const e = parseDate(endsOn);
  if (s.year !== e.year) {
    return `${s.day} de ${MONTHS[s.month - 1]} de ${s.year} al ${e.day} de ${MONTHS[e.month - 1]} de ${e.year}`;
  }
  if (s.month !== e.month) {
    return `${s.day} de ${MONTHS[s.month - 1]} al ${e.day} de ${MONTHS[e.month - 1]} de ${s.year}`;
  }
  return `${s.day} al ${e.day} de ${MONTHS[s.month - 1]} de ${s.year}`;
}

// Bloque de fecha para tarjetas: { day: "11" | "10-12", month: "MAY", year }
export function eventDateBlock(startsOn: string, endsOn: string | null) {
  const s = parseDate(startsOn);
  const e = endsOn ? parseDate(endsOn) : null;
  const sameMonth = e && e.month === s.month && e.year === s.year;
  const multiDay = e && endsOn !== startsOn;
  return {
    day: multiDay && sameMonth ? `${s.day}-${e.day}` : String(s.day),
    month: MONTHS[s.month - 1].slice(0, 3).toUpperCase(),
    year: String(s.year),
    continues: Boolean(multiDay && !sameMonth),
  };
}

// "Hoy", "Mañana", "Faltan 12 días", "En curso".
export function countdownLabel(event: SiteEvent, today = todayInMexico()): string {
  if (event.status === "ongoing") {
    return event.endsOn && event.endsOn !== event.startsOn ? "En curso" : "Hoy";
  }
  if (event.status === "past") return "Finalizado";
  const toUtc = (iso: string) => {
    const d = parseDate(iso);
    return Date.UTC(d.year, d.month - 1, d.day);
  };
  const days = Math.round((toUtc(event.startsOn) - toUtc(today)) / 86_400_000);
  if (days === 1) return "Mañana";
  return `Faltan ${days} días`;
}

export const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: "Próximo",
  ongoing: "En curso",
  past: "Finalizado",
};

// Descripción en texto plano: cada línea en blanco separa un párrafo.
export function descriptionParagraphs(description: string | null): string[] {
  if (!description) return [];
  return description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
