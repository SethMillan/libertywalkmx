"use client";

import { useState } from "react";
import { ASSETS } from "@/lib/assets";

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  vehiculo: string;
  proyecto: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({
    nombre: "",
    email: "",
    telefono: "",
    vehiculo: "",
    proyecto: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
      setStatus("success");
      setForm({ nombre: "", email: "", telefono: "", vehiculo: "", proyecto: "" });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar el correo.");
      setStatus("error");
    }
  };

  const fieldStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow), sans-serif",
    fontSize: 16,
    color: "var(--text-primary)",
    outline: "none",
    width: "100%",
    background: "rgba(255, 255, 255, 0.7)",
    border: "none",
    borderRadius: 6,
    padding: "14px 16px",
  };

  const fields: Array<{
    name: Exclude<keyof FormState, "proyecto">;
    placeholder: string;
    type: string;
    autoComplete: string;
  }> = [
    {
      name: "nombre",
      placeholder: "Nombre completo",
      type: "text",
      autoComplete: "name",
    },
    {
      name: "email",
      placeholder: "Email",
      type: "email",
      autoComplete: "email",
    },
    {
      name: "telefono",
      placeholder: "Teléfono",
      type: "tel",
      autoComplete: "tel",
    },
    {
      name: "vehiculo",
      placeholder: "Vehículo (Ej: Lamborghini Huracán 2022)",
      type: "text",
      autoComplete: "off",
    },
  ];

  return (
    <section
      id="contacto"
      className="relative w-full p-20"
      style={{ background: "rgba(255,255,255,0.8)" }}
    >
      <div className="px-5 sm:px-8 md:px-10 lg:px-20 xl:px-40 pt-14 md:pt-16 lg:pt-20 pb-16">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mx-auto w-full max-w-4xl text-left mb-12 md:mb-14">
            <p
              className="text-[16px] font-medium tracking-[3.2px] capitalize mb-4"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                color: "var(--text-tertiary)",
              }}
            >
              CONTACTO
            </p>
            <h2
              className="font-medium leading-tight mb-5"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                color: "var(--text-primary)",
                fontSize: "clamp(36px, 6vw, 60px)",
              }}
            >
              INICIA TU PROYECTO
            </h2>
            <p
              className="not-italic mb-8 max-w-4xl"
              style={{
                fontFamily: "var(--font-barlow), sans-serif",
                color: "#0c0d0d",
                fontSize: "clamp(15px, 1.4vw, 18px)",
                lineHeight: "clamp(1.55, 2.2vw, 1.8)",
              }}
            >
              Cuéntanos sobre tu vehículo y el body kit que te interesa. Nuestro
              equipo te contactará con información personalizada.
            </p>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-7 md:gap-10">
              <div>
                <p
                  className="text-[14px] font-normal tracking-[2.8px] mb-1"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    color: "rgba(12,13,13,0.5)",
                  }}
                >
                  EMAIL
                </p>
                <p
                  className="text-[18px] font-light tracking-[2px]"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    color: "var(--text-primary)",
                  }}
                >
                  contacto@libertywalk.com.mx
                </p>
              </div>

              <div>
                <p
                  className="text-[14px] font-normal tracking-[2.8px] mb-1"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    color: "rgba(12,13,13,0.5)",
                  }}
                >
                  UBICACIÓN
                </p>
                <p
                  className="text-[18px] md:text-[19px] lg:text-[20px] font-light tracking-[2px] w-full max-w-xl"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    color: "var(--text-primary)",
                  }}
                >
                  Ayala Premium, Morelia, Michoacán, México.
                </p>
              </div>

              <div className="flex gap-4 md:pt-6">
                <img
                  src={ASSETS.iconSocial}
                  alt="Redes sociales"
                  className="w-6 h-6"
                />
                <img
                  src={ASSETS.iconSocial2}
                  alt="Redes sociales"
                  className="w-6 h-6"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <div
              className="w-full max-w-3xl border shadow-sm"
              style={{
                background: "var(--bg-surface)",
                borderColor: "var(--border-default)",
                borderWidth: "0.5px",
              }}
            >
              <form
                onSubmit={handleSubmit}
                className="px-6 sm:px-8 md:px-10 pt-8 md:pt-10 pb-8 md:pb-10"
              >
                <div className="text-center mb-7 md:mb-8">
                  <p
                    className="text-[22px] md:text-[24px] lg:text-[26px] font-medium uppercase"
                    style={{
                      fontFamily: "var(--font-oswald), sans-serif",
                      color: "var(--text-primary)",
                    }}
                  >
                    Solicitar Cotización
                  </p>
                  <div
                    className="mx-auto mt-3 h-px w-24"
                    style={{ background: "var(--border-default)" }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {fields.map(({ name, placeholder, type, autoComplete }) => (
                    <input
                      key={name}
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      aria-label={placeholder}
                      className="placeholder:text-[#6a6a67] placeholder:opacity-80 focus:border-[#090908] transition-colors"
                      style={fieldStyle}
                    />
                  ))}

                  <textarea
                    name="proyecto"
                    value={form.proyecto}
                    onChange={handleChange}
                    rows={4}
                    placeholder="¿Qué kit te interesa? Cuéntanos sobre tu proyecto..."
                    aria-label="Proyecto"
                    className="md:col-span-2 placeholder:text-[#6a6a67] placeholder:opacity-80 focus:border-[#090908] transition-colors resize-none"
                    style={fieldStyle}
                  />
                </div>

                {status === "error" && (
                  <p
                    className="mt-4 text-center text-sm"
                    style={{ color: "#c0392b", fontFamily: "var(--font-barlow), sans-serif" }}
                  >
                    {errorMsg}
                  </p>
                )}

                {status === "success" ? (
                  <p
                    className="mt-6 text-center text-[18px] font-medium"
                    style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-primary)" }}
                  >
                    ¡Solicitud enviada! Te contactaremos pronto.
                  </p>
                ) : (
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group relative overflow-hidden mt-6 h-14 md:h-15 lg:h-16 w-full text-[20px] md:text-[22px] lg:text-[24px] font-medium uppercase cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_14px_28px_rgba(0,0,0,0.2)] hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-none"
                    style={{
                      fontFamily: "var(--font-oswald), sans-serif",
                      background: "var(--text-primary)",
                      color: "var(--text-primary-w)",
                    }}
                  >
                    <span
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[360%]"
                      aria-hidden="true"
                    />
                    <span className="relative z-10">
                      {status === "loading" ? "ENVIANDO..." : "ENVIAR SOLICITUD →"}
                    </span>
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
