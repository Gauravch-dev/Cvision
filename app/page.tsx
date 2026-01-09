import HeroSection from "@/components/landing_page/hero_section";
import { MiddleSection } from "@/components/landing_page/Middle_section";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <HeroSection />
        <MiddleSection />
      </SignedOut>
    </div>
  );
}
