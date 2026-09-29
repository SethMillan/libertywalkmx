// Limpieza de lo que manda el navegador a /api/contact y /api/order-request.
// Todo texto del cliente se escapa antes de insertarlo en el HTML del correo:
// así nadie puede meter etiquetas, links o estilos en los correos que llegan
// a contacto@libertywalk.com.mx.

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

// Texto de una sola línea (nombre, teléfono, vehículo...): sin saltos de
// línea, para que tampoco pueda colarse nada en el asunto del correo.
export function cleanLine(value: unknown, maxLength = 200): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLength);
}

// Texto libre de varias líneas (descripción del proyecto).
export function cleanMultiline(value: unknown, maxLength = 5000): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/g, "\n").trim().slice(0, maxLength);
}

const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

// Solo acepta URLs http(s). Cualquier otro esquema (javascript:, data:...)
// se descarta para que no termine como link dentro del correo.
export function safeHttpUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
