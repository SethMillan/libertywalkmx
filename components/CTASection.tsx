"use client";

import { ASSETS } from "@/lib/assets";
import { slowScrollToHash } from "@/lib/scroll";

export default function CTASection() {
  return (
    <section className="relative h-[500px] md:h-[560px] w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background photo */}
      <img
        src="/corvette.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        aria-hidden="true"
      />

      {/* Glow ellipse */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "-22%", top: "-10%", width: "144%", height: "165%" }}
        aria-hidden="true"
      >
        <img src={ASSETS.ellipse4} alt="" className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-8">
        <h2
          className="font-medium leading-tight mb-4 w-full"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            color: "var(--text-primary-w)",
            fontSize: "clamp(36px, 5vw, 60px)",
            maxWidth: 700,
          }}
        >
          ¿LISTO PARA ELEVAR TU AUTO?
        </h2>

        <p
          className="not-italic mb-8 md:mb-10"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            color: "var(--text-secondary-w)",
            fontSize: "clamp(14px, 4vw, 20px)",
          }}
        >
          Solicita información personalizada. Servicio y venta a todo México.
        </p>

        <a
          href="#contacto"
          onClick={(e) => {
            e.preventDefault();
            slowScrollToHash("#contacto");
          }}
          className="group relative overflow-hidden flex items-center justify-center h-[60px] md:h-[74px] w-[241px] md:w-[336px] font-normal uppercase cursor-pointer transition-all duration-300 ease-out hover:-translate-y-[2px] hover:scale-[1.02] hover:shadow-[0_14px_28px_rgba(0,0,0,0.35)] hover:brightness-110"
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            fontSize: "clamp(24px, 5vw, 36px)",
            background: "var(--text-primary)",
            color: "var(--text-primary-w)",
          }}
        >
          <span
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[360%]"
            aria-hidden="true"
          />
          <span className="relative z-10">contactanos →</span>
        </a>
      </div>
    </section>
  );
}
