import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import EventSection from "@/components/EventSection";
import FeaturedEventSection from "@/components/FeaturedEventSection";
import CatalogSection from "@/components/CatalogSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import { getHomeFeaturedEvent } from "@/lib/events";

// El catálogo de body kits (CatalogSection) lee de Supabase; sin esto la
// página quedaría estática con los datos del último build. Se revalida en
// segundo plano cada hora, sin necesitar un redeploy tras cada re-scrape.
export const revalidate = 3600;

export default async function Home() {
  // Sección de evento: por ahora el video de lanzamiento. Si en Supabase se
  // marca un evento con featured_on_home = true, el home muestra ese evento
  // en su lugar (y vuelve al video en cuanto se desmarca).
  const featuredEvent = await getHomeFeaturedEvent();

  return (
    <>
      <HeroSection />
      <BrandsCarousel />
      <StatsSection />
      <AboutSection />
      {featuredEvent ? <FeaturedEventSection event={featuredEvent} /> : <EventSection />}
      <CatalogSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
