// Datos de contacto y redes compartidos por todo el sitio. Todo el contacto
// es por correo.
export const SITE_URL = "https://libertywalk.com.mx";
// Único correo que se muestra en el sitio (contacto, footer, tarjeta de
// Ayala Premium, eventos). Ojo: los formularios NO usan esta constante; las
// rutas /api/contact y /api/order-request envían a contacto@ con copia a
// gonzalodh@.
export const CONTACT_EMAIL = "gonzalodh@libertywalk.com.mx";
export const INSTAGRAM_URL = "https://www.instagram.com/libertywalkmx";
export const TIKTOK_URL = "https://www.tiktok.com/@libertywalkmx";
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/6RNJxb57wUe6D5iZ7";
export const LBW_JAPAN_URL = "https://libertywalk.co.jp";

export function mailtoWithSubject(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
