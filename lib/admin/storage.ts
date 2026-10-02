// Utilidades del bucket de fotos de eventos (supabase/events.sql y admin.sql).
// Se usan tanto en el navegador (ImageUploader) como en el servidor
// (acciones), por eso este archivo no importa nada de servidor.

export const EVENTS_BUCKET = "events";

// URL pública -> ruta dentro del bucket. Devuelve null si la imagen no es
// de nuestro bucket (p. ej. /eventPhoto.jpeg de public/ o un link externo),
// para no intentar borrar algo que no es nuestro.
export function storagePathFromPublicUrl(url: string, supabaseUrl: string): string | null {
  const prefix = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${EVENTS_BUCKET}/`;
  if (!url.startsWith(prefix)) return null;
  const path = decodeURIComponent(url.slice(prefix.length).split("?")[0]);
  return path && !path.includes("..") ? path : null;
}
