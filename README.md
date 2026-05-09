# Liberty Walk México — Landing Page

Landing page oficial de Liberty Walk México (Ayala Premium, distribuidor oficial). Implementada desde diseño Figma con Next.js 16, React 19 y Tailwind CSS v4.

## Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + TypeScript
- **Estilos:** Tailwind CSS v4
- **Fuentes:** Google Fonts vía `next/font` (Oswald, Bebas Neue, Barlow Condensed, Comfortaa)

## Estructura del proyecto

```
app/
  globals.css       # Design tokens CSS + animación marquee
  layout.tsx        # Carga de fuentes y metadata
  page.tsx          # Composición de secciones

components/
  HeroSection.tsx       # Hero con nav, logo y texto principal
  BrandsCarousel.tsx    # Marquee animado de marcas
  StatsSection.tsx      # Estadísticas: 1993 / 90+ body kits / 11+ países
  AboutSection.tsx      # Sección Wataru Kato (fondo oscuro)
  EventSection.tsx      # Evento 11 MAY 2026 con galería y detalles
  MarcasSection.tsx     # Filtros de marcas interactivos + cards de servicios
  CTASection.tsx        # Banner "¿Listo para elevar tu auto?"
  ContactSection.tsx    # Formulario de cotización
  Footer.tsx            # Logo + copyright

lib/
  assets.ts         # URLs de imágenes (ver nota abajo)
```

## Design tokens

Los colores y superficies están definidos como variables CSS en `globals.css` siguiendo el sistema del Figma:

| Variable | Valor |
|---|---|
| `--text-primary` | `#090908` |
| `--text-primary-w` | `white` |
| `--text-secondary` | `rgba(9,9,8,0.8)` |
| `--text-secondary-w` | `rgba(255,255,255,0.8)` |
| `--text-tertiary` | `rgba(9,9,8,0.7)` |
| `--text-overlay` | `rgba(255,255,255,0.5)` |
| `--bg-surface` | `#f5f5f3` |
| `--bg-surface-2` | `#e8eaea` |
| `--border-default` | `rgba(9,9,8,0.2)` |
| `--placeholder` | `rgba(9,9,8,0.5)` |

## Imágenes

Los assets en `lib/assets.ts` apuntan a URLs del servidor de Figma MCP, **válidas por 7 días**. Antes de hacer deploy a producción:

1. Descarga cada imagen referenciada en `lib/assets.ts`
2. Colócalas en la carpeta `public/`
3. Actualiza las rutas en `lib/assets.ts` a `/nombre-del-archivo.jpg`

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Deploy

```bash
npm run build
npm start
```

O despliega directamente en [Vercel](https://vercel.com/new).
