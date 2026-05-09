"use client";

import { useState } from "react";
import { ASSETS } from "@/lib/assets";

interface FormState {
  nombre: string; email: string; telefono: string; vehiculo: string; proyecto: string;
}

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({ nombre: "", email: "", telefono: "", vehiculo: "", proyecto: "" });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent) => e.preventDefault();

  const fieldStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow), sans-serif",
    fontSize: 16,
    color: "var(--text-primary)",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--border-default)",
    outline: "none",
    width: "100%",
    padding: "6px 0",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow), sans-serif",
    fontSize: 14,
    color: "var(--placeholder)",
    display: "block",
    marginBottom: 3,
  };

  const fields = [
    { name: "nombre",   placeholder: "Nombre Completo", type: "text" },
    { name: "email",    placeholder: "Email",            type: "email" },
    { name: "telefono", placeholder: "Teléfono",         type: "text" },
    { name: "vehiculo", placeholder: "Vehículo (Ej: Lamborghini Huracán 2022)", type: "text" },
  ];

  return (
    <section id="contacto" className="relative w-full" style={{ background: "rgba(255,255,255,0.8)" }}>

      <div className="px-8 md:px-[111px] pt-[55px] md:pt-[75px] pb-16 flex flex-col md:flex-row gap-12 md:gap-0">

        {/* Left – info */}
        <div className="flex-1 md:pt-4">
          <p className="text-[16px] font-medium tracking-[3.2px] capitalize mb-5"
            style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-tertiary)" }}>
            CONTACTO
          </p>
          <h2 className="font-medium leading-tight mb-5 w-full md:w-[437px]"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-primary)",
              fontSize: "clamp(36px, 6vw, 60px)",
            }}>
            INICIA TU PROYECTO
          </h2>
          <p className="text-[16px] not-italic leading-relaxed mb-8 w-full md:w-[520px]"
            style={{ fontFamily: "var(--font-barlow), sans-serif", color: "#0c0d0d" }}>
            Cuéntanos sobre tu vehículo y el body kit que te interesa. Nuestro equipo
            te contactará con información personalizada.
          </p>

          {/* Email */}
          <div className="mb-7">
            <p className="text-[14px] font-normal tracking-[2.8px] mb-1"
              style={{ fontFamily: "var(--font-oswald), sans-serif", color: "rgba(12,13,13,0.5)" }}>EMAIL</p>
            <p className="text-[18px] font-light tracking-[2px]"
              style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-primary)" }}>
              contacto@libertywalk.com.mx
            </p>
          </div>

          {/* Location */}
          <div className="mb-8">
            <p className="text-[14px] font-normal tracking-[2.8px] mb-1"
              style={{ fontFamily: "var(--font-oswald), sans-serif", color: "rgba(12,13,13,0.5)" }}>UBICACIÓN</p>
            <p className="text-[18px] md:text-[20px] font-light tracking-[2px] w-full md:w-[410px]"
              style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-primary)" }}>
              Ayala Premium, Morelia, Michoacán, México.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex gap-4">
            <img src={ASSETS.iconSocial}  alt="Redes sociales" className="w-6 h-6" />
            <img src={ASSETS.iconSocial2} alt="Redes sociales" className="w-6 h-6" />
          </div>
        </div>

        {/* Right – form */}
        <div className="w-full md:w-[400px] md:shrink-0 border"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border-default)", borderWidth: "0.5px" }}>
          <form onSubmit={handleSubmit} className="px-8 pt-10 pb-10 flex flex-col gap-5">
            <p className="text-[22px] md:text-[26px] font-medium uppercase mb-2"
              style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-primary)" }}>
              Solicitar Cotización
            </p>

            {fields.map(({ name, placeholder, type }) => (
              <div key={name}>
                <label style={labelStyle}>{placeholder}</label>
                <input type={type} name={name}
                  value={form[name as keyof FormState]} onChange={handleChange}
                  style={fieldStyle} />
              </div>
            ))}

            <div>
              <label style={labelStyle}>¿Qué kit te interesa? Cuéntanos sobre tu proyecto...</label>
              <textarea name="proyecto" value={form.proyecto} onChange={handleChange}
                rows={3} style={{ ...fieldStyle, resize: "none" }} />
            </div>

            <button type="submit"
              className="mt-2 h-[55px] md:h-[67px] w-full text-[20px] md:text-[24px] font-medium uppercase transition-opacity hover:opacity-90"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                background: "var(--text-primary)",
                color: "var(--text-primary-w)",
              }}>
              ENVIAR SOLICITUD →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
