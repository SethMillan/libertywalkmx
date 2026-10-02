import type { Metadata } from "next";
import { getEvents, isLive } from "@/lib/events";
import { INSTAGRAM_URL } from "@/lib/site";
import { LIVE_RED, LiveEventCard, PastEventCard } from "@/components/EventCards";

// Igual que el resto del sitio: se revalida cada hora. Eso también mueve un
// evento de "próximo" a "finalizado" sin redeploy cuando pasa su fecha.
export const revalidate = 3600;

const description =
  "Lanzamientos, exhibiciones y reuniones de Liberty Walk México. Consulta los próximos eventos y revive los anteriores.";

export const metadata: Metadata = {
  title: "Eventos",
  description,
  alternates: { canonical: "/eventos" },
  openGraph: {
    title: "Eventos | Liberty Walk México",
    description,
    url: "/eventos",
  },
};

const oswald: React.CSSProperties = { fontFamily: "var(--font-oswald), sans-serif" };
const barlow: React.CSSProperties = { fontFamily: "var(--font-barlow), sans-serif" };

function GroupHeading({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-6 flex items-center gap-4 md:mb-8">
      <h2
        className="shrink-0 text-[18px] font-medium uppercase tracking-[3.6px] md:text-[20px] md:tracking-[4px]"
        style={{ ...oswald, color: "var(--text-primary)" }}
      >
        {label}
      </h2>
      <span
        className="shrink-0 text-[14px] font-medium tracking-[2px]"
        style={{ ...oswald, color: "var(--text-tertiary)" }}
      >
        {String(count).padStart(2, "0")}
      </span>
      <span className="h-px flex-1" style={{ background: "var(--border-default)" }} />
    </div>
  );
}

function InstagramNote({ text }: { text: string }) {
  return (
    <div
      className="flex flex-col items-start justify-between gap-4 px-7 py-8 md:flex-row md:items-center md:px-10"
      style={{ background: "#090908" }}
    >
      <p className="text-[16px] md:text-[18px]" style={{ ...barlow, color: "var(--text-secondary-w)" }}>
        {text}
      </p>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 border px-5 py-2.5 text-[14px] font-medium uppercase tracking-[2px] text-white transition-colors duration-200 hover:bg-white hover:text-black"
        style={{ ...oswald, borderColor: "rgba(255,255,255,0.5)" }}
      >
        @libertywalkmx
      </a>
    </div>
  );
}

export default async function EventosPage() {
  // Ya vienen del más reciente al más antiguo: los próximos quedan arriba.
  const events = await getEvents();
  const live = events.filter((e) => isLive(e.status));
  const past = events.filter((e) => !isLive(e.status));

  return (
    <section
      className="relative w-full px-15 md:px-20 lg:px-20 xl:px-40 pt-[120px] md:pt-[140px] pb-20"
      style={{ background: "var(--bg-surface)" }}
    >
      <header className="mb-12 md:mb-16">
        <p
          className="mb-3 flex items-center gap-2 text-[18px] font-medium tracking-[3.6px] md:mb-4 md:text-[20px] md:tracking-[4px]"
          style={{ ...oswald, color: "var(--text-tertiary)" }}
        >
          <span style={{ fontFamily: "var(--font-bebas), sans-serif" }}>★</span>
          LIBERTY WALK MÉXICO
        </p>
        <h1
          className="mb-5 text-[40px] font-medium leading-none md:text-[70px]"
          style={{ ...oswald, color: "var(--text-primary)" }}
        >
          EVENTOS
        </h1>
        <p
          className="max-w-2xl text-[16px] leading-relaxed md:text-[18px]"
          style={{ ...barlow, color: "var(--text-secondary)" }}
        >
          Lanzamientos, exhibiciones y reuniones de la comunidad Liberty Walk en
          México, del más reciente al más antiguo.
        </p>

        {events.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="Simbología">
            <li
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium uppercase tracking-[1.8px]"
              style={{ ...oswald, background: "#090908", color: "var(--text-primary-w)" }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: LIVE_RED }} />
              Próximos y en curso
            </li>
            <li
              className="inline-flex items-center gap-2 border px-3 py-1.5 text-[12px] font-medium uppercase tracking-[1.8px]"
              style={{ ...oswald, borderColor: "var(--border-default)", color: "var(--text-tertiary)" }}
            >
              Finalizados
            </li>
          </ul>
        )}
      </header>

      {events.length === 0 ? (
        <InstagramNote text="Muy pronto publicaremos aquí los eventos de Liberty Walk México. Síguenos para enterarte primero." />
      ) : (
        <>
          <div className="mb-16 md:mb-20">
            <GroupHeading label="Próximos y en curso" count={live.length} />
            {live.length > 0 ? (
              <div className="flex flex-col gap-6 md:gap-8">
                {live.map((event) => (
                  <LiveEventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <InstagramNote text="Por ahora no hay eventos próximos. Síguenos para enterarte primero del siguiente." />
            )}
          </div>

          {past.length > 0 && (
            <div>
              <GroupHeading label="Eventos anteriores" count={past.length} />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {past.map((event) => (
                  <PastEventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
