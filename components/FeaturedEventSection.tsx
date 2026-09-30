import Link from "next/link";
import {
  type SiteEvent,
  countdownLabel,
  formatEventDate,
  isLive,
} from "@/lib/events";
import { EventStatusBadge } from "@/components/EventCards";

// Sección de evento del home cuando hay un evento con `featured_on_home`.
// Mientras no haya ninguno, el home sigue mostrando EventSection (el video
// de lanzamiento). Ver app/page.tsx.

const oswald: React.CSSProperties = { fontFamily: "var(--font-oswald), sans-serif" };
const barlow: React.CSSProperties = { fontFamily: "var(--font-barlow), sans-serif" };

export default function FeaturedEventSection({ event }: { event: SiteEvent }) {
  const live = isLive(event.status);
  const meta = [
    formatEventDate(event.startsOn, event.endsOn),
    event.timeLabel,
    [event.venue, event.city].filter(Boolean).join(", "),
  ].filter(Boolean);

  return (
    <section id="evento" className="relative w-full pb-20" style={{ background: "var(--bg-surface)" }}>
      <div className="px-15 md:px-20 lg:px-20 xl:px-40 pt-[66px] md:pt-[97px]">
        <div className="flex flex-col items-center gap-12 md:flex-row lg:gap-20 xl:gap-30">
          <div className="min-w-0 flex-1 basis-0">
            <div
              className="mb-4 flex items-center gap-2 text-[18px] font-medium tracking-[3.6px] md:mb-6 md:text-[20px] md:tracking-[4px]"
              style={{ ...oswald, color: "var(--text-tertiary)" }}
            >
              <span style={{ fontFamily: "var(--font-bebas), sans-serif" }}>★</span>
              <span>{live ? "PRÓXIMO EVENTO" : "EVENTO DESTACADO"}</span>
            </div>

            <h2
              className="mb-6 w-full text-[40px] font-medium uppercase leading-tight md:mb-8 md:text-[60px]"
              style={{ ...oswald, color: "var(--text-primary)" }}
            >
              {event.title}
            </h2>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span
                className="text-[15px] font-medium uppercase tracking-[2px] md:text-[17px]"
                style={{ ...oswald, color: "var(--text-primary)" }}
              >
                {meta.join(" · ")}
              </span>
              {live && (
                <span
                  className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-[1.5px]"
                  style={{ ...oswald, background: "var(--text-primary)", color: "var(--text-primary-w)" }}
                >
                  {countdownLabel(event)}
                </span>
              )}
            </div>

            {event.summary && (
              <p
                className="mb-10 w-full text-[clamp(16px,1.8vw,20px)] leading-relaxed md:mb-12"
                style={{ ...barlow, color: "var(--text-secondary)" }}
              >
                {event.summary}
              </p>
            )}

            <div className="mb-8 flex flex-wrap items-center gap-5">
              <Link
                href={`/eventos/${event.slug}`}
                className="inline-flex h-12 items-center px-7 text-[15px] font-medium uppercase tracking-[1.5px] transition-opacity hover:opacity-85"
                style={{ ...oswald, background: "var(--text-primary)", color: "var(--text-primary-w)" }}
              >
                Ver evento
              </Link>
              <Link
                href="/eventos"
                className="text-[15px] font-medium uppercase tracking-[2px] underline-offset-4 hover:underline"
                style={{ ...oswald, color: "var(--text-tertiary)" }}
              >
                Todos los eventos →
              </Link>
            </div>
            <div className="mb-8 h-[6px] w-[20%] bg-black/70" />
          </div>

          <div className="w-full min-w-0 flex-1 basis-0">
            <Link
              href={`/eventos/${event.slug}`}
              className="group relative block w-full overflow-hidden bg-black"
              style={{ height: "565px" }}
            >
              {event.coverUrl && (
                <img
                  src={event.coverUrl}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <EventStatusBadge event={event} className="absolute left-4 top-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
