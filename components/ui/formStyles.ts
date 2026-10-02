// Estilos de formulario compartidos (contacto del home y panel /admin).
// 16px de texto evita que Safari en iPhone haga zoom al enfocar el campo.
// Los estilos van en clases (no inline) para que el estado de foco funcione.
export const FIELD_CLASS =
  "block w-full border border-(--border-default) bg-(--bg-surface) px-4 text-[16px] text-(--text-primary) outline-none transition-colors duration-200 placeholder:text-[#8a8a86] hover:border-[rgba(9,9,8,0.45)] focus:border-(--text-primary) focus:bg-white";

export const LABEL_CLASS = "mb-2 block text-[12px] font-medium uppercase tracking-[2px]";

export const oswald: React.CSSProperties = { fontFamily: "var(--font-oswald), sans-serif" };
export const barlow: React.CSSProperties = { fontFamily: "var(--font-barlow), sans-serif" };
export const bebas: React.CSSProperties = { fontFamily: "var(--font-bebas), sans-serif" };
