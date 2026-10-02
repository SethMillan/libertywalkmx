import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listAllEvents, type AdminEvent } from "@/lib/admin/events";
import { STATUS_LABEL, formatEventDate } from "@/lib/events";
import AdminPageHeader, { PRIMARY_BUTTON } from "@/components/admin/AdminPageHeader";
import DeleteEventButton from "@/components/admin/DeleteEventButton";
import Notice from "@/components/admin/Notice";
import { barlow, oswald } from "@/components/ui/formStyles";

export const metadata: Metadata = { title: "Eventos" };

function Chip({ tone, children }: { tone: "dark" | "outline" | "live"; children: React.ReactNode }) {
  const styles: Record<typeof tone, React.CSSProperties> = {
    dark: { background: "#090908", color: "#fff", borderColor: "#090908" },
    outline: { background: "transparent", color: "var(--text-tertiary)", borderColor: "var(--border-default)" },
    live: { background: "#fff", color: "var(--text-primary)", borderColor: "var(--text-primary)" },
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[1.5px]"
      style={{ ...oswald, ...styles[tone] }}
    >
      {tone === "live" && <span className="h-1.5 w-1.5 rounded-full bg-[#c0392b]" />}
      {children}
    </span>
  );
}

function Chips({ event }: { event: AdminEvent }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <Chip tone={event.isPublished ? "dark" : "outline"}>{event.isPublished ? "Publicado" : "Borrador"}</Chip>
      <Chip tone={event.status === "past" ? "outline" : "live"}>{STATUS_LABEL[event.status]}</Chip>
      {event.featuredOnHome && <Chip tone="dark">★ En el home</Chip>}
    </div>
  );
}

function Thumb({ event, className }: { event: AdminEvent; className: string }) {
  return (
    <div className={`shrink-0 overflow-hidden bg-(--bg-surface-2) ${className}`}>
      {event.coverUrl ? (
        <img src={event.coverUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <img src="/lbLogo.png" alt="" className="w-8 opacity-30" />
        </div>
      )}
    </div>
  );
}

function RowActions({ event }: { event: AdminEvent }) {
  const link = "text-[13px] font-medium uppercase tracking-[1.5px] text-(--text-primary) underline-offset-4 hover:underline";
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <Link href={`/admin/eventos/${event.id}`} className={link} style={oswald}>
        Editar
      </Link>
      {event.isPublished && (
        <a href={`/eventos/${event.slug}`} target="_blank" rel="noopener noreferrer" className={link} style={oswald}>
          Ver ↗
        </a>
      )}
      <DeleteEventButton id={event.id} title={event.title} compact />
    </div>
  );
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { ok } = await searchParams;

  let events: AdminEvent[] = [];
  let loadError = false;
  try {
    events = await listAllEvents(supabase);
  } catch {
    loadError = true;
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Panel"
        title="Eventos"
        description="Del más reciente al más antiguo, igual que en el sitio. Los borradores no se ven en el sitio."
        actions={
          <Link href="/admin/eventos/nuevo" className={PRIMARY_BUTTON} style={{ ...oswald, background: "var(--text-primary)" }}>
            + Nuevo evento
          </Link>
        }
      />

      <Notice code={ok} />

      {loadError ? (
        <div className="border bg-white px-6 py-6 text-[15px] leading-relaxed" style={{ ...barlow, borderColor: "#c0392b", color: "#c0392b" }}>
          No se pudo leer la tabla de eventos. Revisa que en Supabase ya se hayan corrido
          supabase/events.sql y supabase/admin.sql.
        </div>
      ) : events.length === 0 ? (
        <div className="border bg-white px-6 py-12 text-center" style={{ borderColor: "var(--border-default)" }}>
          <p className="mb-2 text-[22px] font-medium uppercase" style={{ ...oswald, color: "var(--text-primary)" }}>
            Todavía no hay eventos
          </p>
          <p className="mb-6 text-[15px]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
            Crea el primero y aparecerá en /eventos en cuanto lo publiques.
          </p>
          <Link href="/admin/eventos/nuevo" className={PRIMARY_BUTTON} style={{ ...oswald, background: "var(--text-primary)" }}>
            + Nuevo evento
          </Link>
        </div>
      ) : (
        <>
          {/* Escritorio: tabla */}
          <div className="hidden border bg-white md:block" style={{ borderColor: "var(--border-default)" }}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border-default)" }}>
                  {["Evento", "Fecha", "Estado", "Acciones"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 py-3 text-[12px] font-medium uppercase tracking-[2px]"
                      style={{ ...oswald, color: "var(--text-tertiary)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b last:border-b-0" style={{ borderColor: "var(--border-default)" }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <Thumb event={event} className="h-14 w-20" />
                        <div className="min-w-0">
                          <Link
                            href={`/admin/eventos/${event.id}`}
                            className="block text-[17px] font-medium leading-snug text-(--text-primary) hover:underline"
                            style={oswald}
                          >
                            {event.title}
                          </Link>
                          <p className="text-[14px] [overflow-wrap:anywhere]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
                            /eventos/{event.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[15px]" style={{ ...barlow, color: "var(--text-secondary)" }}>
                      {formatEventDate(event.startsOn, event.endsOn)}
                      <span className="block text-[14px] text-(--text-tertiary)">{event.city}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Chips event={event} />
                    </td>
                    <td className="px-5 py-4">
                      <RowActions event={event} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Teléfono: tarjetas */}
          <ul className="flex flex-col gap-3 md:hidden">
            {events.map((event) => (
              <li key={event.id} className="border bg-white" style={{ borderColor: "var(--border-default)" }}>
                <Link href={`/admin/eventos/${event.id}`} className="flex gap-4 p-4">
                  <Thumb event={event} className="h-16 w-20" />
                  <div className="min-w-0">
                    <p className="text-[17px] font-medium leading-snug text-(--text-primary)" style={oswald}>
                      {event.title}
                    </p>
                    <p className="text-[14px]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
                      {formatEventDate(event.startsOn, event.endsOn)} · {event.city}
                    </p>
                  </div>
                </Link>
                <div className="flex flex-col gap-3 border-t px-4 py-3" style={{ borderColor: "var(--border-default)" }}>
                  <Chips event={event} />
                  <RowActions event={event} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
