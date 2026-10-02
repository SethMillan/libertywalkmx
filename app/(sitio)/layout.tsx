import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

// Datos estructurados (schema.org) del negocio, presentes en todas las
// páginas públicas — ayuda a que Google entienda quiénes somos, dónde estamos y
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
  email: CONTACT_EMAIL,
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

export default function SitioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
      />
      <NavBar />
      <main className="flex flex-col w-full flex-1">{children}</main>
      <Footer />
    </>
  );
}
