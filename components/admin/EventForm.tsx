"use client";

import { useCallback, useState, useTransition } from "react";
import Link from "next/link";
import type { AdminEvent } from "@/lib/admin/events";
import { saveEvent, type EventFieldName, type SaveEventResult } from "@/app/admin/(panel)/eventos/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "@/components/admin/AdminPageHeader";
import { FIELD_CLASS, LABEL_CLASS, barlow, oswald } from "@/components/ui/formStyles";

// Formulario de crear/editar evento. Los campos son controlados (no se usa
// <form action>) para que un error de validación no borre lo escrito.

type TextField = Exclude<EventFieldName, "cover_url" | "gallery_urls">;

type Values = Record<TextField, string> & {
  cover: string[];
  gallery: string[];
  is_published: boolean;
  featured_on_home: boolean;
};

const EVENT_TYPES = ["Rueda de prensa", "Exhibición", "Meet", "Lanzamiento", "Unboxing", "Car show"];

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/★/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

function initialValues(event?: AdminEvent): Values {
  return {
    title: event?.title ?? "",
    slug: event?.slug ?? "",
    event_type: event?.eventType ?? "",
    starts_on: event?.startsOn ?? "",
    ends_on: event?.endsOn ?? "",
    time_label: event?.timeLabel ?? "",
    venue: event?.venue ?? "",
    city: event?.city ?? "",
    address: event?.address ?? "",
    maps_url: event?.mapsUrl ?? "",
    summary: event?.summary ?? "",
    description: event?.description ?? "",
    video_url: event?.videoUrl ?? "",
    external_url: event?.externalUrl ?? "",
    cover: event?.coverUrl ? [event.coverUrl] : [],
    gallery: event?.galleryUrls ?? [],
    is_published: event?.isPublished ?? false,
    featured_on_home: event?.featuredOnHome ?? false,
  };
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="border bg-white" style={{ borderColor: "var(--border-default)" }}>
      <div className="border-b px-5 py-4 sm:px-7" style={{ borderColor: "var(--border-default)" }}>
        <h2 className="text-[18px] font-medium uppercase tracking-[1.5px]" style={{ ...oswald, color: "var(--text-primary)" }}>
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-[14px]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-7">{children}</div>
    </section>
  );
}

function Toggle({
  id,
  checked,
  onChange,
  label,
  help,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  help: string;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-4 sm:col-span-2">
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="h-7 w-12 border border-(--text-primary) bg-white transition-colors peer-checked:bg-(--text-primary) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black" />
        <span className="absolute left-1 top-1 h-5 w-5 bg-(--text-primary) transition-transform peer-checked:translate-x-5 peer-checked:bg-white" />
      </span>
      <span>
        <span className="block text-[15px] font-medium uppercase tracking-[1.5px]" style={{ ...oswald, color: "var(--text-primary)" }}>
          {label}
        </span>
        <span className="block text-[14px] leading-snug" style={{ ...barlow, color: "var(--text-tertiary)" }}>
          {help}
        </span>
      </span>
    </label>
  );
}

export default function EventForm({
  event,
  supabaseUrl,
  supabaseAnonKey,
}: {
  event?: AdminEvent;
  supabaseUrl: string;
  supabaseAnonKey: string;
}) {
  const isEdit = Boolean(event);
  const [values, setValues] = useState<Values>(() => initialValues(event));
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [result, setResult] = useState<SaveEventResult | null>(null);
  const [busyUploads, setBusyUploads] = useState({ cover: false, gallery: false });
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof Values>(key: K, value: Values[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const onCoverBusy = useCallback((b: boolean) => setBusyUploads((s) => ({ ...s, cover: b })), []);
  const onGalleryBusy = useCallback((b: boolean) => setBusyUploads((s) => ({ ...s, gallery: b })), []);
  const uploading = busyUploads.cover || busyUploads.gallery;
  const errors = result?.fieldErrors ?? {};

  function field(
    name: TextField,
    label: string,
    opts: {
      required?: boolean;
      type?: string;
      placeholder?: string;
      help?: string;
      full?: boolean;
      list?: string;
      maxLength?: number;
      inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
      onValue?: (v: string) => void;
    } = {},
  ) {
    const id = `evento-${name}`;
    const error = errors[name];
    return (
      <div className={opts.full ? "sm:col-span-2" : undefined}>
        <label htmlFor={id} className={LABEL_CLASS} style={{ ...oswald, color: "var(--text-tertiary)" }}>
          {label}
          {opts.required && <span aria-hidden="true"> *</span>}
        </label>
        <input
          id={id}
          name={name}
          type={opts.type ?? "text"}
          value={values[name]}
          onChange={(e) => (opts.onValue ? opts.onValue(e.target.value) : set(name, e.target.value))}
          placeholder={opts.placeholder}
          required={opts.required}
          list={opts.list}
          maxLength={opts.maxLength}
          inputMode={opts.inputMode}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || opts.help ? `${id}-help` : undefined}
          className={`${FIELD_CLASS} h-12 ${error ? "border-[#c0392b]" : ""}`}
          style={barlow}
        />
        {(error || opts.help) && (
          <p id={`${id}-help`} className="mt-1.5 text-[14px]" style={{ ...barlow, color: error ? "#c0392b" : "var(--text-tertiary)" }}>
            {error ?? opts.help}
          </p>
        )}
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (uploading) return;
    const fd = new FormData();
    if (event) fd.set("id", String(event.id));
    (Object.keys(values) as (keyof Values)[]).forEach((key) => {
      const v = values[key];
      if (typeof v === "string") fd.set(key, v);
    });
    fd.set("cover_url", values.cover[0] ?? "");
    fd.set("gallery_urls", JSON.stringify(values.gallery));
    if (values.is_published) fd.set("is_published", "on");
    if (values.featured_on_home) fd.set("featured_on_home", "on");

    startTransition(async () => {
      const res = await saveEvent(fd);
      if (res) {
        setResult(res);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  const slugChanged = isEdit && event && values.slug !== event.slug;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 pb-28">
      {result && (
        <div role="alert" className="border px-4 py-3 text-[15px]" style={{ ...barlow, background: "#fff", borderColor: "#c0392b", color: "#c0392b" }}>
          {result.message}
        </div>
      )}

      <Section title="Información">
        {field("title", "Nombre del evento", {
          required: true,
          full: true,
          maxLength: 160,
          placeholder: "Ej: Liberty Walk en Expo Tuning CDMX",
          onValue: (v) =>
            setValues((s) => ({ ...s, title: v, slug: slugTouched ? s.slug : slugify(v) })),
        })}
        {field("slug", "Dirección (URL)", {
          required: true,
          full: true,
          maxLength: 100,
          help: slugChanged
            ? "Cambiar la dirección rompe los links que ya se hayan compartido."
            : `libertywalk.com.mx/eventos/${values.slug || "..."}`,
          onValue: (v) => {
            setSlugTouched(true);
            set("slug", v.toLowerCase().replace(/\s+/g, "-"));
          },
        })}
        {field("event_type", "Tipo de evento", {
          list: "evento-tipos",
          maxLength: 80,
          placeholder: "Ej: Exhibición",
        })}
        <datalist id="evento-tipos">
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </Section>

      <Section title="Fecha y lugar">
        {field("starts_on", "Fecha de inicio", { required: true, type: "date" })}
        {field("ends_on", "Fecha de fin", { type: "date", help: "Solo si dura varios días." })}
        {field("time_label", "Horario", { maxLength: 80, placeholder: "Ej: 12:00 PM o 11:00 a 19:00 h" })}
        {field("venue", "Lugar", { maxLength: 160, placeholder: "Ej: Centro Citibanamex" })}
        {field("city", "Ciudad", { required: true, maxLength: 120, placeholder: "Ej: Ciudad de México" })}
        {field("address", "Dirección", { maxLength: 240 })}
        {field("maps_url", "Link de Google Maps", { full: true, type: "url", inputMode: "url", placeholder: "https://maps.app.goo.gl/..." })}
      </Section>

      <Section title="Textos">
        <div className="sm:col-span-2">
          <label htmlFor="evento-summary" className={LABEL_CLASS} style={{ ...oswald, color: "var(--text-tertiary)" }}>
            Resumen
          </label>
          <textarea
            id="evento-summary"
            rows={2}
            maxLength={400}
            value={values.summary}
            onChange={(e) => set("summary", e.target.value)}
            className={`${FIELD_CLASS} resize-y py-3 leading-relaxed`}
            style={barlow}
          />
          <p className="mt-1.5 text-[14px]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
            Una o dos líneas. Aparece en la tarjeta del evento. {values.summary.length}/400
          </p>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="evento-description" className={LABEL_CLASS} style={{ ...oswald, color: "var(--text-tertiary)" }}>
            Descripción
          </label>
          <textarea
            id="evento-description"
            rows={8}
            maxLength={8000}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${FIELD_CLASS} min-h-[180px] resize-y py-3 leading-relaxed`}
            style={barlow}
          />
          <p className="mt-1.5 text-[14px]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
            Texto de la página del evento. Deja una línea en blanco para separar párrafos.
          </p>
        </div>
      </Section>

      <Section title="Imágenes" description="Las fotos se optimizan automáticamente al subirlas.">
        <div className="sm:col-span-2">
          <p className={LABEL_CLASS} style={{ ...oswald, color: "var(--text-tertiary)" }}>
            Portada
          </p>
          <ImageUploader
            multiple={false}
            inputId="evento-portada"
            value={values.cover}
            onChange={(urls) => set("cover", urls)}
            onBusyChange={onCoverBusy}
            supabaseUrl={supabaseUrl}
            supabaseAnonKey={supabaseAnonKey}
          />
          {errors.cover_url && (
            <p className="mt-1.5 text-[14px]" style={{ ...barlow, color: "#c0392b" }}>{errors.cover_url}</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <p className={LABEL_CLASS} style={{ ...oswald, color: "var(--text-tertiary)" }}>
            Galería
          </p>
          <ImageUploader
            multiple
            inputId="evento-galeria"
            value={values.gallery}
            onChange={(urls) => set("gallery", urls)}
            onBusyChange={onGalleryBusy}
            supabaseUrl={supabaseUrl}
            supabaseAnonKey={supabaseAnonKey}
          />
          {errors.gallery_urls && (
            <p className="mt-1.5 text-[14px]" style={{ ...barlow, color: "#c0392b" }}>{errors.gallery_urls}</p>
          )}
        </div>
        {field("video_url", "Video", { full: true, type: "url", inputMode: "url", placeholder: "https://...", help: "Link directo a un video (por ejemplo, de Cloudinary)." })}
      </Section>

      <Section title="Publicación">
        {field("external_url", "Link de más información", {
          full: true,
          type: "url",
          inputMode: "url",
          placeholder: "https://...",
          help: "Opcional: registro, boletos o post de Instagram.",
        })}
        <Toggle
          id="evento-publicado"
          checked={values.is_published}
          onChange={(v) => set("is_published", v)}
          label="Publicado"
          help="Si está apagado, el evento se guarda como borrador y no aparece en el sitio."
        />
        <Toggle
          id="evento-destacado"
          checked={values.featured_on_home}
          onChange={(v) => set("featured_on_home", v)}
          label="Destacar en el home"
          help="Reemplaza el video de lanzamiento del home con este evento. Solo puede haber uno; los demás se desmarcan."
        />
      </Section>

      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 backdrop-blur lg:left-[264px]"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-12">
          <p className="hidden text-[14px] sm:block" style={{ ...barlow, color: "var(--text-tertiary)" }}>
            {uploading ? "Espera a que terminen de subir las fotos..." : "Los campos con * son obligatorios."}
          </p>
          <div className="flex w-full gap-3 sm:w-auto">
            <Link href="/admin/eventos" className={`${SECONDARY_BUTTON} shrink-0 px-4 sm:px-5`} style={oswald}>
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={pending || uploading}
              className={`${PRIMARY_BUTTON} flex-1 whitespace-nowrap px-4 sm:flex-none sm:px-5`}
              style={{ ...oswald, background: "var(--text-primary)" }}
            >
              {pending ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
