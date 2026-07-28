import HeroSection from "@/components/HeroSection";
import BrandsCarousel from "@/components/BrandsCarousel";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import EventSection from "@/components/EventSection";
import CatalogSection from "@/components/CatalogSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";

// El catálogo de body kits (CatalogSection) lee de Supabase; sin esto la
// página quedaría estática con los datos del último build. Se revalida en
// segundo plano cada hora, sin necesitar un redeploy tras cada re-scrape.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandsCarousel />
      <StatsSection />
      <AboutSection />
      <EventSection />
      <CatalogSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
