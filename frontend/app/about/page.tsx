"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Target, Cpu, Users } from "lucide-react";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = containerRef.current.clientHeight;
      
      const scrollDist = sectionHeight - windowHeight;
      const currentScroll = -rect.top;
      
      let progress = currentScroll / scrollDist;
      progress = Math.min(Math.max(progress, 0), 1);
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helpers
  // Total Scroll Space: 600vh
  // 0.0 - 0.15: Hero
  // 0.20 - 0.40: Mission
  // 0.45 - 0.75: Founders (Extended visibility)
  // 0.80 - 1.00: CTA

  const opacityHero = SCROLL_MAP(scrollProgress, 0, 0.1, 1, 0);
  const scaleHero = SCROLL_MAP(scrollProgress, 0, 0.1, 1, 0.8);
  
  const opacityMission = SCROLL_MAP(scrollProgress, 0.15, 0.25, 0, 1);
  const opacityMissionOut = SCROLL_MAP(scrollProgress, 0.4, 0.45, 1, 0);
  const scaleMission = SCROLL_MAP(scrollProgress, 0.15, 0.25, 0.8, 1);
  const yMission = SCROLL_MAP(scrollProgress, 0.15, 0.25, 100, 0);

  const opacityFounders = SCROLL_MAP(scrollProgress, 0.45, 0.55, 0, 1);
  const opacityFoundersOut = SCROLL_MAP(scrollProgress, 0.75, 0.85, 1, 0);
  const yFounders = SCROLL_MAP(scrollProgress, 0.45, 0.55, 100, 0);

  const opacityCTA = SCROLL_MAP(scrollProgress, 0.85, 0.9, 0, 1);
  const scaleCTA = SCROLL_MAP(scrollProgress, 0.85, 0.9, 0.5, 1);

  return (
    <div ref={containerRef} className="h-[600vh] relative bg-background">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Global Background Elements (No Purple Gradient) */}
        <div className="absolute inset-0 pointer-events-none">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
             <div className="noise-overlay opacity-30" />
        </div>

        {/* PHASE 1: HERO */}
        <div 
            className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10"
            style={{ opacity: opacityHero, transform: `scale(${scaleHero})`, pointerEvents: opacityHero < 0.1 ? 'none' : 'auto' }}
        >
             <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium tracking-wide animate-pulse">
                OUR STORY
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50">
                About <span className="text-primary italic">Us</span>
            </h1>
            <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                We're a team of dreamers and doers building the future of equitable hiring.
            </p>
        </div>

        {/* PHASE 2: MISSION & TECH */}
        <div 
            className="absolute inset-0 flex items-center justify-center z-20 px-4"
             style={{ 
                opacity: scrollProgress < 0.45 ? opacityMission : opacityMissionOut,
                transform: `translateY(${yMission}px) scale(${scaleMission})`,
                pointerEvents: (scrollProgress > 0.15 && scrollProgress < 0.45) ? 'auto' : 'none'
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
                <div className="p-10 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl">
                     <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                        <Target className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        To dismantle systemic bias in recruitment. We believe talent is distributed equally, but opportunity is not. CVision exists to fix that equation.
                    </p>
                </div>
                 <div className="p-10 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 mb-6">
                        <Cpu className="w-7 h-7" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Our Technology</h3>
                     <p className="text-lg text-muted-foreground leading-relaxed">
                        Powered by next-generation Vector Search and LLMs. We look beyond keywords to understand semantic context, intent, and potential.
                    </p>
                </div>
            </div>
        </div>

        {/* PHASE 3: FOUNDERS */}
        <div 
            className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4 pointer-events-none"
             style={{ 
                opacity: scrollProgress < 0.8 ? opacityFounders : opacityFoundersOut,
                 transform: `translateY(${yFounders}px)`,
            }}
        >
             <div className="relative pointer-events-auto">
                <h2 className="text-5xl font-bold tracking-tight mb-12 flex items-center justify-center gap-4 text-center">
                    <Users className="w-10 h-10 text-primary" /> Meet The Founders
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full mx-auto">
                    {[
                        { name: "Shubham K", role: "Co-Founder", color: "from-blue-500" },
                        { name: "Joy B", role: "Co-Founder", color: "from-indigo-500" },
                        { name: "Anjan T", role: "Co-Founder", color: "from-green-500" },
                        { name: "Gaurav C", role: "Co-Founder", color: "from-orange-500" }
                    ].map((founder, i) => (
                        <div key={i} className="group relative p-8 bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl text-center overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50">
                            <div className={`absolute inset-0 bg-gradient-to-br ${founder.color} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                            <div className="relative z-10">
                                <div className="w-24 h-24 mx-auto bg-muted rounded-full mb-6 p-1 border-2 border-transparent group-hover:border-primary/50 transition-colors">
                                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <span className="text-3xl font-black text-muted-foreground/30 group-hover:text-foreground transition-colors">
                                            {founder.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{founder.name}</h3>
                                <p className="text-sm text-muted-foreground">{founder.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* PHASE 4: CTA */}
         <div 
            className="absolute inset-0 flex flex-col items-center justify-center z-40"
            style={{ 
                opacity: opacityCTA,
                transform: `scale(${scaleCTA})`,
                pointerEvents: opacityCTA > 0.5 ? 'auto' : 'none'
            }}
        >
             <Link href="/sign-up">
                <Button size="lg" className="h-24 px-16 text-3xl font-black rounded-full shadow-[0_0_50px_rgba(var(--primary),0.5)] hover:shadow-[0_0_100px_rgba(var(--primary),0.8)] hover:scale-105 transition-all duration-300">
                    Join Our Journey <ArrowRight className="ml-4 w-8 h-8" />
                </Button>
            </Link>
             <p className="mt-8 text-muted-foreground text-lg">Be part of the revolution.</p>
        </div>

      </div>
    </div>
  );
}

function SCROLL_MAP(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    if (value < inMin) return outMin;
    if (value > inMax) return outMax;
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
