import HeroSection from "@/components/landing_page/hero_section";
import { MiddleSection } from "@/components/landing_page/Middle_section";
import { ComparisonSection } from "@/components/landing_page/ComparisonSection";
import { HowItWorks } from "@/components/landing_page/HowItWorks";
import { SmartParsingSection } from "@/components/landing_page/SmartParsingSection";
import { MatchEngineSection } from "@/components/landing_page/MatchEngineSection";
import { SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen overflow-visible">
      <div className="noise-overlay" />
      <SignedOut>
        <HeroSection />
        <ComparisonSection /> {/* Differentiator */}
        <SmartParsingSection /> {/* New: Visualizing extraction */}
        <MatchEngineSection />  {/* New: Visualizing matching */}
        <MiddleSection />     {/* Horizontal Scroll */}
        <HowItWorks />        {/* Sticky Stack */}
      </SignedOut>
    </div>
  );
}
