import Hero from "../components/landing/Hero";
import LiveDemoSection from "../components/landing/LiveDemoSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import IntelligencePreview from "../components/landing/IntelligencePreview";
import AboutSection from "../components/landing/AboutSection";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <div className="bg-background text-foreground">
        <LiveDemoSection />
        <FeaturesSection />
        <HowItWorksSection />
        <IntelligencePreview />
        <AboutSection />
      </div>
    </div>
  );
}
