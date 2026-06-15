import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { VirtualExpo } from '@/components/VirtualExpo';
import { BrandHighlights } from '@/components/BrandHighlights';
import { WhyAttend } from '@/components/WhyAttend';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'FUTURE CONSUMER EXPO 2026',
  description: 'Where Technology Meets Consumer Experience',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Virtual Expo Area */}
        <VirtualExpo />

        {/* Brand Highlights Section */}
        <BrandHighlights />

        {/* Why Attend Section */}
        <WhyAttend />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

