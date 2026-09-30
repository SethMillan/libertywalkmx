// Datos de contacto y redes compartidos por las páginas nuevas (eventos,
// nosotros, footer). Todo el contacto del sitio es por correo.
export const SITE_URL = "https://libertywalk.com.mx";
export const CONTACT_EMAIL = "contacto@libertywalk.com.mx";
export const INSTAGRAM_URL = "https://www.instagram.com/libertywalkmx";
export const TIKTOK_URL = "https://www.tiktok.com/@libertywalkmx";
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/6RNJxb57wUe6D5iZ7";
export const LBW_JAPAN_URL = "https://libertywalk.co.jp";

export function mailtoWithSubject(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
