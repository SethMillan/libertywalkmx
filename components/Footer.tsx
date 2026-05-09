import { ASSETS } from "@/lib/assets";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-6 md:py-0 md:h-[140px] gap-4 md:gap-0"
      style={{ background: "var(--bg-surface)" }}>

      {/* Logo */}
      <div className="flex items-center gap-3">
        <img src={ASSETS.lbMxLogo} alt="Liberty Walk México"
          className="w-[40px] h-[40px] md:w-[65px] md:h-[65px] object-cover opacity-70" />
        <p className="text-[16px] md:text-[20px] font-semibold leading-none"
          style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--placeholder)" }}>
          LIBERTY WALK MÉXICO
        </p>
      </div>

      {/* Copyright */}
      <p className="text-[12px] md:text-[16px] font-light tracking-[2px] md:tracking-[3.2px] text-center"
        style={{ fontFamily: "var(--font-oswald), sans-serif", color: "var(--text-primary)" }}>
        © 2026 LIBERTY WALK MX. TODOS LOS DERECHOS RESERVADOS
      </p>
    </footer>
  );
}
