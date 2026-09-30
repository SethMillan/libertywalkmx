import Link from "next/link";
import {
  type SiteEvent,
  STATUS_LABEL,
  countdownLabel,
  eventDateBlock,
  formatEventDate,
} from "@/lib/events";

// Tarjetas de /eventos. La diferencia visual entre próximos y pasados es
// intencionalmente fuerte:
//   * Próximo / en curso -> tarjeta grande, fondo negro, a color, con cuenta
//     regresiva.
//   * Pasado -> tarjeta chica y clara, foto en blanco y negro (se colorea al
//     pasar el mouse), etiqueta "Finalizado".

const oswald: React.CSSProperties = { fontFamily: "var(--font-oswald), sans-serif" };
const barlow: React.CSSProperties = { fontFamily: "var(--font-barlow), sans-serif" };

export const LIVE_RED = "#c0392b";

export function EventStatusBadge({
  event,
  className = "",
}: {
  event: SiteEvent;
  className?: string;
}) {
  if (event.status === "past") {
    return (
      <span
        className={`inline-flex items-center border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[1.5px] ${className}`}
        style={{
          ...oswald,
          background: "rgba(245,245,243,0.92)",
          borderColor: "var(--border-default)",
          color: "var(--text-tertiary)",
        }}
      >
        {STATUS_LABEL.past}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[1.5px] ${className}`}
      style={{ ...oswald, background: "#fff", color: "var(--text-primary)" }}
    >
      <span className="relative flex h-2 w-2">
        {event.status === "ongoing" && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: LIVE_RED }}
          />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: LIVE_RED }} />
      </span>
      {STATUS_LABEL[event.status]}
    </span>
  );
}

function CoverImage({
  event,
  className,
}: {
  event: SiteEvent;
  className: string;
}) {
  if (!event.coverUrl) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/lbLogo.png" alt="" aria-hidden="true" className="w-24 opacity-30" />
      </div>
    );
  }
  return (
    <img
      src={event.coverUrl}
      alt={event.title}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

function ArrowLink({ label, light }: { label: string; light?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-[2px] md:text-[15px]"
      style={{ ...oswald, color: light ? "var(--text-primary-w)" : "var(--text-primary)" }}
    >
      <span className="relative pb-1">
        {label}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100"
        />
      </span>
      <span
        aria-hidden="true"
        className="transition-transform duration-300 ease-out group-hover:translate-x-1"
      >
        →
      </span>
    </span>
  );
}

export function LiveEventCard({ event }: { event: SiteEvent }) {
  const date = eventDateBlock(event.startsOn, event.endsOn);
  const place = [event.venue, event.city].filter(Boolean).join(", ");

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group grid overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(9,9,8,0.35)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
      style={{ background: "#090908" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black md:aspect-auto md:min-h-[440px]">
        <CoverImage
          event={event}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <EventStatusBadge event={event} className="absolute left-4 top-4" />
      </div>

      <div className="flex flex-col justify-between gap-8 px-7 py-8 md:px-10 md:py-10 lg:px-12">
        <div>
          <div className="mb-6 flex flex-wrap items-end gap-x-5 gap-y-3">
            <div className="flex items-end gap-3 leading-none" style={{ color: "var(--text-primary-w)" }}>
              <span className="text-[64px] font-medium md:text-[84px]" style={oswald}>
                {date.day}
              </span>
              <span className="pb-2 text-[16px] font-medium tracking-[3px] md:pb-3 md:text-[18px]" style={oswald}>
                {date.month}
                <br />
                {date.year}
              </span>
            </div>
            <span
              className="mb-2 border px-3 py-1.5 text-[12px] font-medium uppercase tracking-[2px] md:mb-3"
              style={{ ...oswald, borderColor: "rgba(255,255,255,0.35)", color: "var(--text-primary-w)" }}
            >
              {countdownLabel(event)}
            </span>
          </div>

          {event.eventType && (
            <p
              className="mb-2 text-[13px] font-medium uppercase tracking-[3px] md:text-[14px]"
              style={{ ...oswald, color: "var(--text-overlay)" }}
            >
              {event.eventType}
            </p>
          )}
          <h3
            className="mb-4 text-[30px] font-medium uppercase leading-tight md:text-[42px]"
            style={{ ...oswald, color: "var(--text-primary-w)" }}
          >
            {event.title}
          </h3>
          {event.summary && (
            <p
              className="max-w-xl text-[16px] leading-relaxed md:text-[18px]"
              style={{ ...barlow, color: "var(--text-secondary-w)" }}
            >
              {event.summary}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <dl
            className="grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-3"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            {[
              { label: "Fecha", value: formatEventDate(event.startsOn, event.endsOn) },
              { label: "Horario", value: event.timeLabel },
              { label: "Lugar", value: place },
            ]
              .filter((m) => m.value)
              .map((m) => (
                <div key={m.label}>
                  <dt
                    className="mb-1 text-[12px] uppercase tracking-[2.4px]"
                    style={{ ...oswald, color: "var(--text-overlay)" }}
                  >
                    {m.label}
                  </dt>
                  <dd className="text-[16px]" style={{ ...barlow, color: "var(--text-primary-w)" }}>
                    {m.value}
                  </dd>
                </div>
              ))}
          </dl>
          <ArrowLink label="Ver detalles" light />
        </div>
      </div>
    </Link>
  );
}

export function PastEventCard({ event }: { event: SiteEvent }) {
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex flex-col overflow-hidden border border-(--border-default) transition-all duration-300 ease-out hover:-translate-y-1 hover:border-(--text-primary) hover:shadow-[0_18px_34px_rgba(9,9,8,0.2)]"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--bg-surface-2)" }}>
        <CoverImage
          event={event}
          className="absolute inset-0 h-full w-full object-cover opacity-85 grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
        />
        <EventStatusBadge event={event} className="absolute left-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col px-5 py-4">
        <p
          className="mb-1 text-[13px] font-medium uppercase tracking-[2px]"
          style={{ ...oswald, color: "var(--text-tertiary)" }}
        >
          {formatEventDate(event.startsOn, event.endsOn)}
        </p>
        <p
          className="mb-2 text-[19px] font-medium leading-snug"
          style={{ ...oswald, color: "var(--text-primary)" }}
        >
          {event.title}
        </p>
        <p className="mt-auto text-[15px]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
          {[event.eventType, event.city].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
