import type { Metadata } from "next";
import {
  Oswald,
  Bebas_Neue,
  Barlow_Condensed,
  Comfortaa,
  Poppins,
} from "next/font/google";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-barlow",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-comfortaa",
  display: "swap",
});

// Usada solo en la dealer card de Ayala Premium (LocalDealerInfo), que
// replica un diseño hecho con Poppins.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_NAME = "Liberty Walk México";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Liberty Walk México — Distribuidor Oficial de Body Kits",
    template: "%s | Liberty Walk México",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "body kit",
    "body kits México",
    "Liberty Walk México",
    "Liberty Walk body kit",
    "wide body kit",
    "kit de carrocería",
    "personalización de autos",
    "Ayala Premium",
    "LB Performance",
    "LB Works",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Liberty Walk México — Distribuidor Oficial de Body Kits",
    description: SITE_DESCRIPTION,
    images: [{ url: "/ctaBackground.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liberty Walk México — Distribuidor Oficial de Body Kits",
    description: SITE_DESCRIPTION,
    images: ["/ctaBackground.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/logo.png", type: "image/png", sizes: "192x192" }],
    apple: [{ url: "/logo.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${oswald.variable} ${bebasNeue.variable} ${barlowCondensed.variable} ${comfortaa.variable} ${poppins.variable} h-full`}
    >
      {/* El NavBar, el Footer y los datos del negocio viven en
          app/(sitio)/layout.tsx; el panel (app/admin) tiene su propio marco. */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
