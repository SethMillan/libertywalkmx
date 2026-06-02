"use client";

import { useState, useEffect, useCallback } from "react";

const CARS = [
  {
    name: "Lamborghini Aventador",
    image: "/aventador.png",
    mobileImage: "/telefono/aventador.png",
  },
  {
    name: "Ferrari 488",
    image: "/ferrari-488.png",
    mobileImage: "/telefono/ferrari-488.png",
  },
  {
    name: "Lamborghini Huracan",
    image: "/huracan.png",
    mobileImage: "/telefono/huracan.png",
  },
  {
    name: "McLaren 720S",
    image: "/mclaren.png",
    mobileImage: "/telefono/mclaren.png",
  },
];

const INTERVAL_MS = 5000;

export default function HeroSection() {
  const [current, setCurrent] = useState(2);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (index === current || transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTransitioning(false);
      }, 150);
    },
    [current, transitioning],
  );

  useEffect(() => {
    const t = setInterval(
      () => setCurrent((p) => (p + 1) % CARS.length),
      INTERVAL_MS,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="inicio"
      className="relative w-full h-screen min-h-175 overflow-hidden"
    >
      {/* Fondos en crossfade */}
      {CARS.map((car, i) => (
        <picture
          key={car.name}
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-1000"
          style={{
            opacity: i === current ? 1 : 0,
            filter: "brightness(0.55) contrast(0.8) saturate(1.2)",
          }}
          aria-hidden="true"
        >
          <source media="(max-width: 767px)" srcSet={car.mobileImage} />
          <img src={car.image} alt="" className="w-full h-full object-cover" />
        </picture>
      ))}

      {/* Glow ellipse */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          left: "-47%",
          top: "-34%",
          width: "102%",
          height: "188%",
          background: "black",
          filter: "blur(100px)",
          opacity: 0.5,
        }}
        aria-hidden="true"
      />

      {/* Degradado inferior */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Overlay negro con opacidad */}
      <div
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: 0.10 }}
      />

      {/* ── Hero copy ── */}
      {/* Subtitle */}
      <div
        className="absolute"
        style={{ left: "clamp(38px, 7.7%, 99px)", top: "28%" }}
      >
        <p
          className="text-white/80 not-italic leading-normal"
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "clamp(12px, 3.5vw, 20px)",
            letterSpacing: "clamp(4px, 1.6%, 6.4px)",
          }}
        >
          AYALA PREMIUM <br />
          DISTRIBUIDOR OFICIAL EN MÉXICO
        </p>
      </div>

      {/* LIBERTY WALK + MÉXICO */}
      <div
        className="absolute text-white font-medium leading-none flex flex-col"
        style={{
          left: "clamp(38px, 7.7%, 99px)",
          top: "36%",
          fontFamily: "var(--font-oswald), sans-serif",
          gap: "clamp(12px, 1.5vw, 32px)",
        }}
      >
        <div style={{ fontSize: "clamp(36px, 4.7vw, 60px)" }}>LIBERTY WALK</div>
        <div style={{ fontSize: "clamp(60px, 9.4vw, 120px)" }}>MÉXICO</div>
        {/* Description */}
        <p
          className=" text-white/80 not-italic leading-relaxed "
          style={{
            left: "clamp(38px, 7.7%, 99px)",
            top: "clamp(61%, 64%, 70%)",
            width: "clamp(260px, 50%, 510px)",
            fontFamily: "var(--font-barlow), sans-serif",
            fontSize: "clamp(16px, 2.2vw, 17px)",
          }}
        >
          La marca japonesa de personalización más icónica del mundo, ahora con
          presencia oficial en México. Body kits y personalización de
          superdeportivos al más alto nivel.
        </p>
      </div>

      {/* ── Car selector ── */}
      <div
        className="absolute right-0 flex flex-col bottom-60"
        style={{
          top: "67%",
          transform: "translateY(-50%)",
          gap: "clamp(20px, 3vh, 32px)",
        }}
      >
        {CARS.map(({ name }, i) => {
          const isActive = i === current;
          return (
            <button
              key={name}
              onClick={() => goTo(i)}
              className="flex items-center justify-end cursor-pointer "
              style={{
                gap: "clamp(8px, 2vw, 12px)",
                paddingRight: "clamp(12px, 3vw, 16px)",
              }}
              aria-label={`Ver ${name}`}
            >
              <span
                className="not-italic transition-colors duration-500 text-right"
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontWeight: 500,
                  fontSize: "clamp(12px, 3.5vw, 16px)",
                  color: isActive ? "white" : "rgba(255,255,255,0.45)",
                }}
              >
                {name}
              </span>
              <div
                className="h-0.5 shrink-0 transition-all duration-500"
                style={{
                  width: isActive
                    ? "clamp(36px, 5vw, 64px)"
                    : "clamp(24px, 3vw, 40px)",
                  background: isActive ? "white" : "rgba(255,255,255,0.45)",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* ── Scroll indicator (desktop) ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-scroll-float">
        <span
          className="text-white/50 font-semibold"
          style={{
            fontFamily: "var(--font-comfortaa), sans-serif",
            fontSize: "clamp(14px, 4vw, 22px)",
          }}
        >
          scroll
        </span>
        <div className="w-0.5 h-10.5 bg-white/50" />
      </div>

      {/* ── SWIPE indicator (mobile) ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex md:hidden flex-col items-center gap-2">
        <span
          className="text-white/50 font-semibold tracking-widest"
          style={{
            fontFamily: "var(--font-comfortaa), sans-serif",
            fontSize: "clamp(12px, 3.5vw, 18px)",
          }}
        >
          swipe
        </span>
        <div className="relative flex flex-col items-center w-6 h-12">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-white/25" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white/50 bg-white/10 animate-swipe-down" />
        </div>
      </div>
    </section>
  );
}
