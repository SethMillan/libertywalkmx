import type { Metadata } from "next";
import {
  Oswald,
  Bebas_Neue,
  Barlow_Condensed,
  Comfortaa,
  Poppins,
} from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
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

const SITE_URL = "https://libertywalk.com.mx";
const SITE_NAME = "Liberty Walk México";
const SITE_DESCRIPTION =
  "Ayala Premium, distribuidor oficial de Liberty Walk en México. Body kits FRP, CFRP y Dry Carbon para Lamborghini, Ferrari, McLaren, Porsche, Nissan y más — importados directo de Japón.";

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

// Datos estructurados (schema.org) del negocio, presentes en todas las
// páginas — ayuda a que Google entienda quiénes somos, dónde estamos y
// pueda mostrar un rich snippet (dirección, teléfono, redes) en resultados
// de búsqueda por "Liberty Walk México" / "body kit México".
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoPartsStore",
  name: "Liberty Walk México — Ayala Premium",
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  telephone: "+52-984-169-8148",
  email: "contacto@libertywalk.com.mx",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av Solidaridad 165, Nueva Chapultepec",
    addressLocality: "Morelia",
    addressRegion: "Michoacán",
    postalCode: "58280",
    addressCountry: "MX",
  },
  areaServed: "MX",
  sameAs: [
    "https://www.instagram.com/libertywalkmx",
    "https://www.tiktok.com/@libertywalkmx",
  ],
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
        <NavBar />
        <main className="flex flex-col w-full flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
