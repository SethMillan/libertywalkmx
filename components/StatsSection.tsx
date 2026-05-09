"use client";

import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.4) {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, triggered };
}

function useCountUp(target: number, triggered: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [triggered, target, duration]);
  return value;
}

function useScramble(target: string, triggered: boolean) {
  const [display, setDisplay] = useState(target.replace(/\d/g, "-"));
  useEffect(() => {
    if (!triggered) return;
    const digits = "0123456789";
    const targetArr = target.split("");
    const lockAt = targetArr.map((_, i) => 8 + i * 7);
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const result = targetArr.map((ch, i) =>
        frame >= lockAt[i] ? ch : digits[Math.floor(Math.random() * 10)],
      );
      setDisplay(result.join(""));
      if (frame >= lockAt[lockAt.length - 1]) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [triggered, target]);
  return display;
}

const numStyle: React.CSSProperties = {
  fontFamily: "var(--font-oswald), sans-serif",
  fontWeight: 400,
  lineHeight: 1,
  color: "var(--text-primary)",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-oswald), sans-serif",
  fontWeight: 400,
  letterSpacing: "4px",
  color: "var(--text-secondary)",
};

export default function StatsSection() {
  const { ref, triggered } = useInView();
  const bodyKits = useCountUp(90, triggered, 1800);
  const paises = useCountUp(11, triggered, 1400);
  const year = useScramble("1993", triggered);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="w-full border-b"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--text-primary)",
      }}
    >
      {/* ── Mobile layout: 2 rows ── */}
      <div className="md:hidden">
        {/* Row 1: 1993 full width */}
        <div
          className="flex flex-col items-center justify-center h-[154px] border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <p style={{ ...numStyle, fontSize: 50 }}>{year}</p>
          <p style={{ ...labelStyle, fontSize: 16, marginTop: 4 }}>
            FUNDADA EN JAPÓN
          </p>
        </div>

        {/* Row 2: 2 columns */}
        <div className="grid grid-cols-2 h-[154px]">
          <div
            className="flex flex-col items-center justify-center border-r"
            style={{ borderColor: "var(--border-default)" }}
          >
            <p style={{ ...numStyle, fontSize: 50 }}>
              {bodyKits}
              <span style={{ fontSize: 36 }}>+</span>
            </p>
            <p style={{ ...labelStyle, fontSize: 16, marginTop: 4 }}>
              BODY KITS
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p style={{ ...numStyle, fontSize: 50 }}>
              {paises}
              <span style={{ fontSize: 36 }}>+</span>
            </p>
            <p style={{ ...labelStyle, fontSize: 16, marginTop: 4 }}>PAISES</p>
          </div>
        </div>
      </div>

      {/* ── Tablet layout: 3 columns ── */}
      <div className="hidden md:grid lg:hidden md:grid-cols-3 md:h-[240px]">
        <div className="flex flex-col items-center justify-center">
          <p style={{ ...numStyle, fontSize: 70 }}>{year}</p>
          <p style={{ ...labelStyle, fontSize: 14, marginTop: 6 }}>
            FUNDADA EN JAPÓN
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center"
          style={{
            borderLeft: "1px solid var(--border-default)",
            borderRight: "1px solid var(--border-default)",
          }}
        >
          <p style={{ ...numStyle, fontSize: 70 }}>
            {bodyKits}
            <span style={{ fontSize: 50 }}>+</span>
          </p>
          <p style={{ ...labelStyle, fontSize: 14, marginTop: 6 }}>BODY KITS</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p style={{ ...numStyle, fontSize: 70 }}>
            {paises}
            <span style={{ fontSize: 50 }}>+</span>
          </p>
          <p style={{ ...labelStyle, fontSize: 14, marginTop: 6 }}>PAISES</p>
        </div>
      </div>

      {/* ── Desktop layout: 3 columns ── */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:h-[300px]">
        <div className="flex flex-col items-center justify-center">
          <p style={{ ...numStyle, fontSize: 100 }}>{year}</p>
          <p style={{ ...labelStyle, fontSize: 20, marginTop: 8 }}>
            FUNDADA EN JAPÓN
          </p>
        </div>
        <div
          className="flex flex-col items-center justify-center"
          style={{
            borderLeft: "1px solid var(--border-default)",
            borderRight: "1px solid var(--border-default)",
          }}
        >
          <p style={{ ...numStyle, fontSize: 100 }}>
            {bodyKits}
            <span style={{ fontSize: 70 }}>+</span>
          </p>
          <p style={{ ...labelStyle, fontSize: 20, marginTop: 8 }}>BODY KITS</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p style={{ ...numStyle, fontSize: 100 }}>
            {paises}
            <span style={{ fontSize: 70 }}>+</span>
          </p>
          <p style={{ ...labelStyle, fontSize: 20, marginTop: 8 }}>PAISES</p>
        </div>
      </div>
    </section>
  );
}
