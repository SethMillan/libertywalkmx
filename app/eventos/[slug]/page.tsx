import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  type SiteEvent,
  countdownLabel,
  descriptionParagraphs,
  formatEventDate,
  getEventBySlug,
  getEvents,
  isLive,
} from "@/lib/events";
import { SITE_URL, mailtoWithSubject } from "@/lib/site";
import { EventStatusBadge } from "@/components/EventCards";

export const revalidate = 3600;

// Los eventos publicados se generan en el build. Uno nuevo que se publique
// después se genera en su primera visita (dynamicParams sigue activo).
export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.slug }));
}

function absoluteUrl(url: string | null) {
  return url ? new URL(url, SITE_URL).toString() : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};

  const description =
    event.summary ??
    `${event.title}: ${formatEventDate(event.startsOn, event.endsOn)} en ${event.city}.`;
  const image = absoluteUrl(event.coverUrl);

  return {
    title: event.title,
    description,
    alternates: { canonical: `/eventos/${slug}` },
    openGraph: {
      title: event.title,
      description,
      url: `/eventos/${slug}`,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function eventJsonLd(event: SiteEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startsOn,
    endDate: event.endsOn ?? event.startsOn,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    description: event.summary ?? undefined,
    image: absoluteUrl(event.coverUrl),
    url: `${SITE_URL}/eventos/${event.slug}`,
    location: {
      "@type": "Place",
      name: event.venue ?? event.city,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.address ?? undefined,
        addressLocality: event.city,
        addressCountry: "MX",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Liberty Walk México",
      url: SITE_URL,
    },
  };
}

const oswald: React.CSSProperties = { fontFamily: "var(--font-oswald), sans-serif" };
const barlow: React.CSSProperties = { fontFamily: "var(--font-barlow), sans-serif" };

export default async function EventoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const live = isLive(event.status);
  // Próximos / en curso van en negro, igual que en la lista; los pasados en
  // gris claro.
  const panel = live
    ? {
        background: "#090908",
        title: "var(--text-primary-w)",
        text: "var(--text-secondary-w)",
        muted: "var(--text-overlay)",
        line: "rgba(255,255,255,0.15)",
      }
    : {
        background: "var(--bg-surface-2)",
        title: "var(--text-primary)",
        text: "var(--text-secondary)",
        muted: "var(--text-tertiary)",
        line: "var(--border-default)",
      };

  const place = [event.venue, event.city].filter(Boolean).join(", ");
  const meta = [
    { label: "Fecha", value: formatEventDate(event.startsOn, event.endsOn) },
    { label: "Horario", value: event.timeLabel },
    { label: "Lugar", value: place, href: event.mapsUrl },
    { label: "Dirección", value: event.address },
  ].filter((m) => m.value);
  const paragraphs = descriptionParagraphs(event.description);

  return (
    <section
      className="relative w-full px-15 md:px-20 lg:px-20 xl:px-40 pt-[120px] md:pt-[140px] pb-20"
      style={{ background: "var(--bg-surface)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(event)) }}
      />

      <Link
        href="/eventos"
        className="group mb-6 inline-flex items-center gap-2 text-[14px] font-medium uppercase tracking-[2px] transition-colors hover:text-(--text-primary) md:mb-8"
        style={{ ...oswald, color: "var(--text-tertiary)" }}
      >
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
        Todos los eventos
      </Link>

      <div className="grid overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" style={{ background: panel.background }}>
        <div className="relative aspect-[3/4] overflow-hidden bg-black md:aspect-auto md:min-h-[520px]">
          {event.coverUrl ? (
            <img
              src={event.coverUrl}
              alt={event.title}
              className={`absolute inset-0 h-full w-full object-cover ${live ? "" : "grayscale"}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/lbLogo.png" alt="" aria-hidden="true" className="w-28 opacity-30" />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-8 px-7 py-8 md:px-10 md:py-10 lg:px-12">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <EventStatusBadge event={event} />
              {live && (
                <span
                  className="border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[1.5px]"
                  style={{ ...oswald, borderColor: "rgba(255,255,255,0.35)", color: panel.title }}
                >
                  {countdownLabel(event)}
                </span>
              )}
              {event.eventType && (
                <span
                  className="text-[13px] font-medium uppercase tracking-[3px]"
                  style={{ ...oswald, color: panel.muted }}
                >
                  {event.eventType}
                </span>
              )}
            </div>

            <h1
              className="mb-5 text-[34px] font-medium uppercase leading-tight md:text-[52px]"
              style={{ ...oswald, color: panel.title }}
            >
              {event.title}
            </h1>
            {event.summary && (
              <p className="max-w-xl text-[17px] leading-relaxed md:text-[19px]" style={{ ...barlow, color: panel.text }}>
                {event.summary}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-7">
            <dl className="grid grid-cols-1 gap-5 border-t pt-6 sm:grid-cols-2" style={{ borderColor: panel.line }}>
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="mb-1 text-[12px] uppercase tracking-[2.4px]" style={{ ...oswald, color: panel.muted }}>
                    {m.label}
                  </dt>
                  <dd className="text-[17px]" style={{ ...barlow, color: panel.title }}>
                    {m.href ? (
                      <a href={m.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:opacity-80">
                        {m.value}
                      </a>
                    ) : (
                      m.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-3">
              {event.externalUrl && (
                <a
                  href={event.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center px-6 text-[14px] font-medium uppercase tracking-[1.5px] transition-opacity hover:opacity-85"
                  style={{
                    ...oswald,
                    background: live ? "#fff" : "var(--text-primary)",
                    color: live ? "var(--text-primary)" : "var(--text-primary-w)",
                  }}
                >
                  Más información ↗
                </a>
              )}
              {live && (
                <a
                  href={mailtoWithSubject(`Evento: ${event.title}`)}
                  className="inline-flex h-12 items-center border px-6 text-[14px] font-medium uppercase tracking-[1.5px] transition-colors hover:bg-white hover:text-black"
                  style={{ ...oswald, borderColor: "rgba(255,255,255,0.5)", color: "var(--text-primary-w)" }}
                >
                  Pregunta por correo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {(paragraphs.length > 0 || event.videoUrl) && (
        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          {paragraphs.length > 0 && (
            <div>
              <p
                className="mb-5 text-[16px] font-medium uppercase tracking-[3.2px]"
                style={{ ...oswald, color: "var(--text-tertiary)" }}
              >
                Sobre el evento
              </p>
              <div className="flex max-w-2xl flex-col gap-5">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-[17px] leading-relaxed md:text-[18px]" style={{ ...barlow, color: "var(--text-secondary)" }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}
          {event.videoUrl && (
            <div className="flex items-center justify-center" style={{ background: "#090908" }}>
              <video
                src={event.videoUrl}
                controls
                playsInline
                preload="metadata"
                className="max-h-[70vh] w-auto max-w-full"
              />
            </div>
          )}
        </div>
      )}

      {event.galleryUrls.length > 0 && (
        <div className="mt-14 md:mt-20">
          <p
            className="mb-5 text-[16px] font-medium uppercase tracking-[3.2px]"
            style={{ ...oswald, color: "var(--text-tertiary)" }}
          >
            Galería
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {event.galleryUrls.map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block aspect-[4/3] overflow-hidden"
                style={{ background: "var(--bg-surface-2)" }}
              >
                <img
                  src={url}
                  alt={`${event.title}, foto ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
