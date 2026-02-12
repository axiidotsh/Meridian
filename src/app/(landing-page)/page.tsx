import { Features } from './components/features';
import { Footer } from './components/footer';
import { Hero } from './components/hero';
import { Navbar } from './components/navbar';
import { OpenSource } from './components/open-source';

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <OpenSource />
      <Footer />
    </div>
  );
}
