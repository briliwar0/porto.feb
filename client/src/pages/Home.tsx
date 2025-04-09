import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import MarketplaceSection from '@/components/MarketplaceSection';
import ColorPaletteGenerator from '@/components/ColorPaletteGenerator';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Particles from '@/components/Particles';
import WelcomeMessage from '@/components/WelcomeMessage';

const Home = () => {
  useEffect(() => {
    // Set document title
    document.title = 'Febri Developer | Portfolio';
    
    // Add font awesome CDN
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
    
    // Add Google fonts
    const googleFonts = document.createElement('link');
    googleFonts.rel = 'stylesheet';
    googleFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&family=Space+Mono&display=swap';
    document.head.appendChild(googleFonts);
    
    return () => {
      // Clean up when component unmounts
      document.head.removeChild(fontAwesome);
      document.head.removeChild(googleFonts);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <Particles />
      <Navbar />
      <main>
        <div className="container mx-auto px-6 pt-24 pb-4">
          <WelcomeMessage />
        </div>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <MarketplaceSection />
        <ColorPaletteGenerator />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
