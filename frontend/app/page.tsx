import HeroSection from "@/components/landing_page/hero_section";
import { MiddleSection } from "@/components/landing_page/Middle_section";
import { ComparisonSection } from "@/components/landing_page/ComparisonSection";
import { HowItWorks } from "@/components/landing_page/HowItWorks";
import { SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="perspective-container min-h-screen">
      <div className="noise-overlay" />
      <SignedOut>
        <HeroSection />
        <ComparisonSection /> {/* Differentiator */}
        <MiddleSection />     {/* Horizontal Scroll */}
        <HowItWorks />        {/* Sticky Stack */}
      </SignedOut>
    </div>
  );
}
