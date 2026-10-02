import { barlow, bebas, oswald } from "@/components/ui/formStyles";

// Encabezado común de las páginas del panel: etiqueta con ★, título,
// descripción opcional y acciones a la derecha (botones).
export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p
          className="mb-2 flex items-center gap-2 text-[14px] font-medium uppercase tracking-[3px] md:text-[15px]"
          style={{ ...oswald, color: "var(--text-tertiary)" }}
        >
          <span style={bebas}>★</span>
          {eyebrow}
        </p>
        <h1
          className="text-[34px] font-medium uppercase leading-[1.05] [overflow-wrap:anywhere] md:text-[46px]"
          style={{ ...oswald, color: "var(--text-primary)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed" style={{ ...barlow, color: "var(--text-secondary)" }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export const PRIMARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 px-5 text-[14px] font-medium uppercase tracking-[1.5px] text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-60";

export const SECONDARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 border border-(--text-primary) px-5 text-[14px] font-medium uppercase tracking-[1.5px] text-(--text-primary) transition-colors hover:bg-(--text-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
