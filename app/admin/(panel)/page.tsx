import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { listAllEvents, type AdminEvent } from "@/lib/admin/events";
import { ADMIN_SECTIONS } from "@/lib/admin/sections";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { barlow, oswald } from "@/components/ui/formStyles";

export const metadata: Metadata = { title: "Inicio" };

type Stat = { label: string; value: number };

export default async function AdminHomePage() {
  const { supabase } = await requireAdmin();

  // Números de cada sección. Una sección nueva agrega aquí los suyos.
  const stats: Record<string, Stat[] | null> = {};
  try {
    const events: AdminEvent[] = await listAllEvents(supabase);
    stats.eventos = [
      { label: "Publicados", value: events.filter((e) => e.isPublished).length },
      { label: "Borradores", value: events.filter((e) => !e.isPublished).length },
      { label: "Próximos", value: events.filter((e) => e.isPublished && e.status !== "past").length },
    ];
  } catch {
    stats.eventos = null;
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Panel"
        title="Contenido del sitio"
        description="Elige qué quieres administrar. Los cambios se ven en el sitio en cuanto los guardas."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {ADMIN_SECTIONS.map((section) => {
          const sectionStats = stats[section.key];
          return (
            <Link
              key={section.key}
              href={section.href}
              className="group flex flex-col border bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-(--text-primary) hover:shadow-[0_18px_34px_rgba(9,9,8,0.15)]"
              style={{ borderColor: "var(--border-default)" }}
            >
              <div className="h-[6px] w-full" style={{ background: "#090908" }} />
              <div className="flex flex-1 flex-col px-6 py-6">
                <h2 className="mb-2 text-[26px] font-medium uppercase leading-tight" style={{ ...oswald, color: "var(--text-primary)" }}>
                  {section.label}
                </h2>
                <p className="mb-6 text-[15px] leading-relaxed" style={{ ...barlow, color: "var(--text-secondary)" }}>
                  {section.description}
                </p>

                {sectionStats === null ? (
                  <p className="mb-6 text-[14px]" style={{ ...barlow, color: "#c0392b" }}>
                    No se pudo leer la información. Revisa que ya se hayan corrido los scripts de Supabase.
                  </p>
                ) : sectionStats ? (
                  <dl className="mb-6 grid grid-cols-3 border-y" style={{ borderColor: "var(--border-default)" }}>
                    {sectionStats.map((s) => (
                      <div key={s.label} className="py-3">
                        <dd className="text-[28px] font-medium leading-none" style={{ ...oswald, color: "var(--text-primary)" }}>
                          {s.value}
                        </dd>
                        <dt className="mt-1 text-[12px] uppercase tracking-[2px]" style={{ ...oswald, color: "var(--text-tertiary)" }}>
                          {s.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                ) : null}

                <span
                  className="mt-auto inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-[2px]"
                  style={{ ...oswald, color: "var(--text-primary)" }}
                >
                  Administrar
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
