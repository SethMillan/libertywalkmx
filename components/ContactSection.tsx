"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONTACT_EMAIL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
} from "@/lib/site";
import {
  CheckIcon,
  InstagramIcon,
  MailIcon,
  PinIcon,
  TikTokIcon,
} from "@/components/icons";
import { FIELD_CLASS, LABEL_CLASS } from "@/components/ui/formStyles";

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  vehiculo: string;
  proyecto: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const EMPTY_FORM: FormState = {
  nombre: "",
  email: "",
  telefono: "",
  vehiculo: "",
  proyecto: "",
};

const FIELDS: Array<{
  name: Exclude<keyof FormState, "proyecto">;
  label: string;
  type: string;
  autoComplete: string;
  required?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}> = [
  { name: "nombre", label: "Nombre completo", type: "text", autoComplete: "name", required: true },
  {
    name: "email",
    label: "Correo",
    type: "email",
    autoComplete: "email",
    required: true,
    inputMode: "email",
    placeholder: "tu@correo.com",
  },
  { name: "telefono", label: "Teléfono", type: "tel", autoComplete: "tel", inputMode: "tel" },
  {
    name: "vehiculo",
    label: "Vehículo",
    type: "text",
    autoComplete: "off",
    placeholder: "Marca, modelo y año",
  },
];

const oswald: React.CSSProperties = { fontFamily: "var(--font-oswald), sans-serif" };
const barlow: React.CSSProperties = { fontFamily: "var(--font-barlow), sans-serif" };

function InfoRow({
  icon,
  label,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-4 border-t py-5 ${className}`}
      style={{ borderColor: "var(--border-default)" }}
    >
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center text-white"
        style={{ background: "#090908" }}
      >
        {icon}
      </span>
      <div className="min-w-0 pt-0.5">
        <p
          className="mb-1 text-[12px] font-medium uppercase tracking-[2.4px]"
          style={{ ...oswald, color: "var(--text-tertiary)" }}
        >
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [sentName, setSentName] = useState("");
  const successRef = useRef<HTMLParagraphElement>(null);

  // Al enviar, el foco pasa a la confirmación para que los lectores de
  // pantalla la anuncien y el teclado no quede en un campo que ya no existe.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al enviar");
      }
      setSentName(form.nombre.trim().split(/\s+/)[0] ?? "");
      setForm(EMPTY_FORM);
      setStatus("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Error al enviar el correo.",
      );
      setStatus("error");
    }
  };

  return (
    <section
      id="contacto"
      className="relative w-full px-6 sm:px-10 md:px-20 xl:px-40 py-16 md:py-24"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 xl:gap-20">
        {/* ── Información ── */}
        <div>
          <div
            className="mb-4 flex items-center gap-2 text-[18px] font-medium tracking-[3.6px] md:mb-6 md:text-[20px] md:tracking-[4px]"
            style={{ ...oswald, color: "var(--text-tertiary)" }}
          >
            <span style={{ fontFamily: "var(--font-bebas), sans-serif" }}>★</span>
            <span>CONTACTO</span>
          </div>
          <h2
            className="mb-5 text-[40px] font-medium uppercase leading-[1.05] md:mb-6 md:text-[60px]"
            style={{ ...oswald, color: "var(--text-primary)" }}
          >
            Inicia tu proyecto
          </h2>
          <p
            className="mb-10 max-w-md text-[16px] leading-relaxed md:text-[18px]"
            style={{ ...barlow, color: "var(--text-secondary)" }}
          >
            Cuéntanos sobre tu vehículo y el body kit que te interesa. Nuestro
            equipo te contactará con información personalizada.
          </p>

          <div className="grid border-b sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-1" style={{ borderColor: "var(--border-default)" }}>
            <InfoRow icon={<MailIcon className="h-5 w-5" />} label="Correo">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[17px] text-(--text-primary) underline-offset-4 [overflow-wrap:anywhere] hover:underline"
                style={barlow}
              >
                {CONTACT_EMAIL}
              </a>
            </InfoRow>

            <InfoRow icon={<PinIcon className="h-5 w-5" />} label="Ubicación">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[17px] leading-snug text-(--text-primary) underline-offset-4 hover:underline"
                style={barlow}
              >
                Ayala Premium
                <br />
                Morelia, Michoacán
              </a>
            </InfoRow>

            <InfoRow
              icon={<span className="text-[20px] font-medium leading-none" style={oswald}>@</span>}
              label="Síguenos"
              className="sm:col-span-2 lg:col-span-1"
            >
              <p className="mb-3 text-[17px]" style={{ ...barlow, color: "var(--text-primary)" }}>
                @libertywalkmx
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Instagram", href: INSTAGRAM_URL, icon: <InstagramIcon className="h-4 w-4" /> },
                  { label: "TikTok", href: TIKTOK_URL, icon: <TikTokIcon className="h-4 w-4" /> },
                ].map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} Liberty Walk México`}
                    className="inline-flex h-9 items-center gap-2 border border-(--border-default) px-3 text-[13px] font-medium uppercase tracking-[1.5px] text-(--text-primary) transition-colors duration-200 hover:border-(--text-primary) hover:bg-(--text-primary) hover:text-white"
                    style={oswald}
                  >
                    {icon}
                    {label}
                  </a>
                ))}
              </div>
            </InfoRow>
          </div>

          <p
            className="mt-5 text-[13px] uppercase tracking-[2px]"
            style={{ ...oswald, color: "var(--text-tertiary)" }}
          >
            Servicio y venta a todo México.
          </p>
        </div>

        {/* ── Formulario ── */}
        <div className="w-full border bg-white" style={{ borderColor: "var(--border-default)" }}>
          <div
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4 sm:px-8 md:py-5 lg:px-10"
            style={{ background: "#090908" }}
          >
            <p
              className="text-[18px] font-medium uppercase tracking-[1.5px] text-white md:text-[20px]"
              style={oswald}
            >
              Solicitar cotización
            </p>
            <p className="text-[14px]" style={{ ...barlow, color: "var(--text-overlay)" }}>
              Te respondemos por correo
            </p>
          </div>

          {status === "success" ? (
            <div role="status" className="flex flex-col items-start px-5 py-10 sm:px-8 md:py-14 lg:px-10">
              <span
                aria-hidden="true"
                className="mb-6 flex h-14 w-14 items-center justify-center text-white"
                style={{ background: "#090908" }}
              >
                <CheckIcon className="h-7 w-7" />
              </span>
              <p
                ref={successRef}
                tabIndex={-1}
                className="mb-3 text-[26px] font-medium uppercase leading-tight outline-none md:text-[30px]"
                style={{ ...oswald, color: "var(--text-primary)" }}
              >
                Solicitud enviada
              </p>
              <p
                className="mb-8 max-w-md text-[16px] leading-relaxed md:text-[18px]"
                style={{ ...barlow, color: "var(--text-secondary)" }}
              >
                {sentName ? `Gracias, ${sentName}. ` : "Gracias. "}
                Te responderemos por correo.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="inline-flex h-12 items-center border border-(--text-primary) px-6 text-[14px] font-medium uppercase tracking-[1.5px] text-(--text-primary) transition-colors duration-200 hover:bg-(--text-primary) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                style={oswald}
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                {FIELDS.map(({ name, label, type, autoComplete, required, inputMode, placeholder }) => (
                  <div key={name}>
                    <label
                      htmlFor={`contacto-${name}`}
                      className={LABEL_CLASS}
                      style={{ ...oswald, color: "var(--text-tertiary)" }}
                    >
                      {label}
                      {required && <span aria-hidden="true"> *</span>}
                    </label>
                    <input
                      id={`contacto-${name}`}
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      autoComplete={autoComplete}
                      inputMode={inputMode}
                      placeholder={placeholder}
                      required={required}
                      className={`${FIELD_CLASS} h-12`}
                      style={barlow}
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="contacto-proyecto"
                    className={LABEL_CLASS}
                    style={{ ...oswald, color: "var(--text-tertiary)" }}
                  >
                    ¿Qué kit te interesa?
                  </label>
                  <textarea
                    id="contacto-proyecto"
                    name="proyecto"
                    value={form.proyecto}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Cuéntanos sobre tu proyecto..."
                    className={`${FIELD_CLASS} min-h-[140px] resize-y py-3 leading-relaxed`}
                    style={barlow}
                  />
                </div>
              </div>

              <div aria-live="polite">
                {status === "error" && (
                  <p className="mt-5 text-[15px]" style={{ ...barlow, color: "#c0392b" }}>
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative mt-6 h-14 w-full cursor-pointer overflow-hidden text-[17px] font-medium uppercase tracking-[2px] text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0 disabled:hover:shadow-none md:text-[18px]"
                style={{ ...oswald, background: "var(--text-primary)" }}
              >
                <span
                  className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[360%]"
                  aria-hidden="true"
                />
                <span className="relative z-10">
                  {status === "loading" ? "Enviando..." : "Enviar solicitud →"}
                </span>
              </button>

              <p className="mt-4 text-[14px]" style={{ ...barlow, color: "var(--text-tertiary)" }}>
                Los campos con * son obligatorios.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
