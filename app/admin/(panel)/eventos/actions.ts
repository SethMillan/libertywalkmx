"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { EVENTS_BUCKET, storagePathFromPublicUrl } from "@/lib/admin/storage";
import type { EventDbInsert } from "@/lib/database.types";
import { cleanLine, cleanMultiline, safeHttpUrl } from "@/lib/sanitize";
import { supabaseConfig, type SessionClient } from "@/lib/supabase/session";

// Acciones del panel de eventos. Igual que una API pública: cada una revisa
// primero que la sesión sea de un admin, y además RLS en Supabase lo impide
// a nivel base de datos.

export type EventFieldName =
  | "title"
  | "slug"
  | "event_type"
  | "starts_on"
  | "ends_on"
  | "time_label"
  | "venue"
  | "city"
  | "address"
  | "maps_url"
  | "summary"
  | "description"
  | "cover_url"
  | "gallery_urls"
  | "video_url"
  | "external_url";

export type SaveEventResult = {
  ok: false;
  message: string;
  fieldErrors: Partial<Record<EventFieldName, string>>;
};

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string) {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

// Imágenes: URL https (Supabase Storage u otra) o ruta local de public/ ("/foto.jpg").
function safeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("..")) return v;
  return safeHttpUrl(v);
}

function optionalUrl(
  formData: FormData,
  name: EventFieldName,
  label: string,
  errors: SaveEventResult["fieldErrors"],
) {
  const raw = cleanLine(formData.get(name), 500);
  if (!raw) return null;
  const url = safeHttpUrl(raw);
  if (!url) errors[name] = `El link de ${label} debe empezar con https://`;
  return url;
}

function parseEventForm(formData: FormData) {
  const errors: SaveEventResult["fieldErrors"] = {};

  const title = cleanLine(formData.get("title"), 160);
  if (!title) errors.title = "Escribe el nombre del evento.";

  const slug = cleanLine(formData.get("slug"), 100).toLowerCase();
  if (!slug) errors.slug = "Escribe la dirección del evento.";
  else if (!SLUG_RE.test(slug))
    errors.slug = "Solo minúsculas, números y guiones (ej. expo-tuning-2026).";

  const startsOn = cleanLine(formData.get("starts_on"), 10);
  if (!startsOn) errors.starts_on = "Elige la fecha del evento.";
  else if (!isValidDate(startsOn)) errors.starts_on = "Fecha no válida.";

  const endsOnRaw = cleanLine(formData.get("ends_on"), 10);
  let endsOn: string | null = null;
  if (endsOnRaw) {
    if (!isValidDate(endsOnRaw)) errors.ends_on = "Fecha no válida.";
    else if (startsOn && endsOnRaw < startsOn)
      errors.ends_on = "La fecha de fin no puede ser antes de la de inicio.";
    else if (endsOnRaw !== startsOn) endsOn = endsOnRaw;
  }

  const city = cleanLine(formData.get("city"), 120);
  if (!city) errors.city = "Escribe la ciudad.";

  const coverRaw = cleanLine(formData.get("cover_url"), 1000);
  const coverUrl = coverRaw ? safeImageUrl(coverRaw) : null;
  if (coverRaw && !coverUrl) errors.cover_url = "La portada no es una imagen válida.";

  let gallery: string[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("gallery_urls") ?? "[]"));
    if (Array.isArray(parsed)) {
      gallery = parsed.slice(0, 40).map(safeImageUrl).filter((u): u is string => Boolean(u));
    }
  } catch {
    errors.gallery_urls = "No se pudo leer la galería.";
  }

  const row: EventDbInsert = {
    title,
    slug,
    starts_on: startsOn,
    ends_on: endsOn,
    city,
    event_type: cleanLine(formData.get("event_type"), 80) || null,
    time_label: cleanLine(formData.get("time_label"), 80) || null,
    venue: cleanLine(formData.get("venue"), 160) || null,
    address: cleanLine(formData.get("address"), 240) || null,
    maps_url: optionalUrl(formData, "maps_url", "Google Maps", errors),
    summary: cleanLine(formData.get("summary"), 400) || null,
    description: cleanMultiline(formData.get("description"), 8000) || null,
    cover_url: coverUrl,
    gallery_urls: gallery,
    video_url: optionalUrl(formData, "video_url", "video", errors),
    external_url: optionalUrl(formData, "external_url", "más información", errors),
    is_published: formData.get("is_published") === "on",
    featured_on_home: formData.get("featured_on_home") === "on",
  };

  return { row, errors };
}

function imagesOf(row: { cover_url: string | null; gallery_urls: string[] | null }) {
  return [row.cover_url, ...(row.gallery_urls ?? [])].filter((u): u is string => Boolean(u));
}

// Borra del bucket las fotos que ya no usa el evento. Si falla no detiene
// el guardado: a lo mucho queda un archivo huérfano en el bucket.
async function removeImages(supabase: SessionClient, urls: string[]) {
  const { url } = supabaseConfig();
  const paths = urls
    .map((u) => storagePathFromPublicUrl(u, url))
    .filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(EVENTS_BUCKET).remove(paths);
  if (error) console.error("[admin/eventos] no se pudieron borrar fotos:", error.message);
}

function revalidateEventPages() {
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/eventos/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export async function saveEvent(formData: FormData): Promise<SaveEventResult | void> {
  const { supabase } = await requireAdmin();

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;
  if (idRaw && (!Number.isInteger(id) || (id ?? 0) <= 0)) {
    return { ok: false, message: "Evento no válido.", fieldErrors: {} };
  }

  const { row, errors } = parseEventForm(formData);
  if (Object.keys(errors).length > 0) {
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors: errors };
  }

  // Al editar, se guardan las fotos anteriores para borrar las que se quitaron.
  let previousImages: string[] = [];
  if (id) {
    const { data: previous, error } = await supabase
      .from("events")
      .select("cover_url, gallery_urls")
      .eq("id", id)
      .maybeSingle();
    if (error || !previous) {
      return { ok: false, message: "No se encontró el evento.", fieldErrors: {} };
    }
    previousImages = imagesOf(previous);
  }

  const query = id
    ? supabase.from("events").update(row).eq("id", id).select("id").single()
    : supabase.from("events").insert(row).select("id").single();
  const { data: saved, error } = await query;

  if (error || !saved) {
    if (error?.code === "23505") {
      return {
        ok: false,
        message: "Revisa los campos marcados.",
        fieldErrors: { slug: "Ya existe un evento con esa dirección." },
      };
    }
    console.error("[admin/eventos] saveEvent:", error?.message);
    return {
      ok: false,
      message: "No se pudo guardar. Intenta de nuevo; si sigue fallando, revisa tu conexión.",
      fieldErrors: {},
    };
  }

  // Solo puede haber un evento destacado en el home.
  if (row.featured_on_home) {
    await supabase
      .from("events")
      .update({ featured_on_home: false })
      .eq("featured_on_home", true)
      .neq("id", saved.id);
  }

  if (previousImages.length > 0) {
    const current = new Set(imagesOf({ cover_url: row.cover_url ?? null, gallery_urls: row.gallery_urls ?? [] }));
    await removeImages(supabase, previousImages.filter((u) => !current.has(u)));
  }

  revalidateEventPages();
  redirect(`/admin/eventos?ok=${id ? "guardado" : "creado"}`);
}

export async function deleteEvent(id: number): Promise<{ ok: false; message: string } | void> {
  const { supabase } = await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, message: "Evento no válido." };

  const { data: existing } = await supabase
    .from("events")
    .select("cover_url, gallery_urls")
    .eq("id", id)
    .maybeSingle();

  // .select() devuelve las filas borradas: si RLS lo impide no hay error,
  // simplemente se borran 0 filas, así que hay que revisarlo.
  const { data: deleted, error } = await supabase.from("events").delete().eq("id", id).select("id");
  if (error || !deleted || deleted.length === 0) {
    console.error("[admin/eventos] deleteEvent:", error?.message ?? "0 filas borradas");
    return { ok: false, message: "No se pudo eliminar. Intenta de nuevo o vuelve a iniciar sesión." };
  }

  if (existing) await removeImages(supabase, imagesOf(existing));

  revalidateEventPages();
  redirect("/admin/eventos?ok=eliminado");
}
