import HeroSection from "@/components/landing_page/hero_section";
import { MiddleSection } from "@/components/landing_page/Middle_section";
import { ComparisonSection } from "@/components/landing_page/ComparisonSection";
import { HowItWorks } from "@/components/landing_page/HowItWorks";
import { SmartParsingSection } from "@/components/landing_page/SmartParsingSection";
import { MatchEngineSection } from "@/components/landing_page/MatchEngineSection";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen overflow-visible">
      <div className="noise-overlay" />

      <HeroSection />
      <ComparisonSection />
      <SmartParsingSection />
      <MatchEngineSection />
      <MiddleSection />
      <HowItWorks />
    </div>
  );
}
