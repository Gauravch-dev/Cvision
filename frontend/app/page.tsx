import { TestimonialsSection } from "@/components/landing_page/TestimonialsSection";
import HeroSection from "@/components/landing_page/hero_section";
import { ProblemSection } from "@/components/landing_page/ProblemSection";
import { SolutionSection } from "@/components/landing_page/SolutionSection";
import { FAQSection } from "@/components/landing_page/FAQSection";


import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen overflow-visible">
      <div className="noise-overlay pointer-events-none" />

      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}
