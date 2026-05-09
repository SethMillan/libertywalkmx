import { ASSETS } from "@/lib/assets";

export default function AboutSection() {
  return (
    <section
      id="nosotros"
      className="relative w-full pl-20 pr-20"
      style={{ background: "#090908" }}
    >
      {/* ── Mobile: stacked column ── */}
      <div className="md:hidden flex flex-col items-center py-12">
        {/* Photo */}
        <div
          className="overflow-hidden"
          style={{
            width: "clamp(220px, 68vw, 300px)",
            height: "clamp(320px, 84vw, 400px)",
          }}
        >
          <img
            src={ASSETS.wataruKato}
            alt="Wataru Kato – fundador de Liberty Walk"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-start text-left mt-8 max-w-sm">
          <p
            className="text-[16px] font-medium tracking-[3.2px] uppercase mb-4"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-primary-w)",
            }}
          >
            LA VISIÓN DE WATARU KATO
          </p>
          <h2
            className="text-[32px] font-medium leading-tight mb-6 w-full text-left"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-primary-w)",
            }}
          >
            DONDE LA TRADICIÓN JAPONESA SE
            <br />
            ENCUENTRA
            <br />
            CON LA AUDACIA
          </h2>
          <p
            className="text-[15px] leading-relaxed not-italic mb-6"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-secondary-w)",
            }}
          >
            Liberty Walk fue fundada por Wataru Kato cuando tenía 26 años,
            operando desde un pequeño lote donde solo podían exhibir 3 autos.
            Desde entonces, ha evolucionado hasta convertirse en uno de los
            nombres más grandes del personalización automotriz mundial.
            <br />
            <br />
            No existe otra marca que sea tan audaz ni que capture el espíritu
            del personalización actual como Liberty Walk. Ahora, esa misma
            pasión y artesanía llegan a México de manera oficial.
          </p>
          <div
            className="w-[54px] h-[2px] mb-4"
            style={{ background: "rgba(255,255,255,0.6)" }}
          />
          <p
            className="text-[13px] not-italic"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-secondary-w)",
            }}
          >
            EST. 1993 — NAGOYA, JAPAN
          </p>
        </div>
      </div>

      {/* ── Tablet: side by side ── */}
      <div className="hidden md:grid lg:hidden grid-cols-[minmax(240px,290px)_minmax(280px,420px)] items-start justify-center gap-6 py-12 h-auto">
        {/* Photo */}
        <div
          className="w-full overflow-hidden"
          style={{ height: "clamp(300px, 44vw, 360px)" }}
        >
          <img
            src={ASSETS.wataruKato}
            alt="Wataru Kato – fundador de Liberty Walk"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-start text-left w-full">
          <p
            className="text-[16px] font-medium tracking-[3.2px] uppercase mb-3"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-primary-w)",
            }}
          >
            LA VISIÓN DE WATARU KATO
          </p>
          <h2
            className="text-[clamp(24px,2.9vw,30px)] font-medium leading-tight mb-4"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-primary-w)",
            }}
          >
            DONDE LA <br />
            TRADICIÓN <br />
            JAPONESA SE ENCUENTRA <br />
            CON LA AUDACIA
          </h2>
          <p
            className="text-[clamp(13px,1.8vw,15px)] leading-relaxed not-italic mb-5"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-secondary-w)",
            }}
          >
            Liberty Walk fue fundada por Wataru Kato cuando tenía 26 años,
            operando desde un pequeño lote donde solo podían exhibir 3 autos.
            Desde entonces, ha evolucionado hasta convertirse en uno de los
            nombres más grandes del personalización automotriz mundial.
            <br />
            <br />
            No existe otra marca que sea tan audaz ni que capture el espíritu
            del personalización actual como Liberty Walk. Ahora, esa misma
            pasión y artesanía llegan a México de manera oficial.
          </p>
          <div
            className="w-[54px] h-[2px] mb-3"
            style={{ background: "rgba(255,255,255,0.6)" }}
          />
          <p
            className="text-[13px] not-italic"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-secondary-w)",
            }}
          >
            EST. 1993 — NAGOYA, JAPAN
          </p>
        </div>
      </div>

      {/* ── Desktop: side by side centered ── */}
      <div className="hidden lg:flex items-center justify-center py-20 h-auto">
        {/* Photo */}
        <div className="w-[460px] h-[460px] overflow-hidden flex-shrink-0 mr-12">
          <img
            src={ASSETS.wataruKato}
            alt="Wataru Kato – fundador de Liberty Walk"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center max-w-lg">
          <p
            className="text-[18px] font-medium tracking-[3.6px] uppercase mb-6"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-primary-w)",
            }}
          >
            LA VISIÓN DE WATARU KATO
          </p>
          <h2
            className="text-[42px] font-medium leading-tight mb-8"
            style={{
              fontFamily: "var(--font-oswald), sans-serif",
              color: "var(--text-primary-w)",
            }}
          >
            DONDE LA <br />
            TRADICIÓN <br />
            JAPONESA SE ENCUENTRA <br />
            CON LA AUDACIA
          </h2>
          <p
            className="text-[16px] leading-relaxed not-italic mb-8"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-secondary-w)",
            }}
          >
            Liberty Walk fue fundada por Wataru Kato cuando tenía 26 años,
            operando desde un pequeño lote donde solo podían exhibir 3 autos.
            Desde entonces, ha evolucionado hasta convertirse en uno de los
            nombres más grandes del personalización automotriz mundial.
            <br />
            <br />
            No existe otra marca que sea tan audaz ni que capture el espíritu
            del personalización actual como Liberty Walk. Ahora, esa misma
            pasión y artesanía llegan a México de manera oficial.
          </p>
          <div
            className="w-[54px] h-[2px] mb-6"
            style={{ background: "rgba(255,255,255,0.6)" }}
          />
          <p
            className="text-[14px] not-italic"
            style={{
              fontFamily: "var(--font-barlow), sans-serif",
              color: "var(--text-secondary-w)",
            }}
          >
            EST. 1993 — NAGOYA, JAPAN
          </p>
        </div>
      </div>
    </section>
  );
}
