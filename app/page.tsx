import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import BrandsCarousel from "@/components/BrandsCarousel";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import EventSection from "@/components/EventSection";
import MarcasSection from "@/components/MarcasSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex flex-col w-full">
        <HeroSection />
        <BrandsCarousel />
        <StatsSection />
        <AboutSection />
        <EventSection />
        <MarcasSection />
        <CTASection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
