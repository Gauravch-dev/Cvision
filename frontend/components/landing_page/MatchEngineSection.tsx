"use client";

import { useRef, useEffect, useState } from "react";
import { User, Briefcase, Zap, Star } from "lucide-react";

export function MatchEngineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollConfig, setScrollConfig] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = containerRef.current.clientHeight;
      
      // Calculate sticky phase progress
      const scrollDist = sectionHeight - windowHeight;
      const currentScroll = -rect.top;
      
      let stickyProgress = currentScroll / scrollDist;
      stickyProgress = Math.min(Math.max(stickyProgress, 0), 1);
      
      setScrollConfig(stickyProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation Config (Strictly mapped to sticky phase)
  // 0.0 - 0.35: Static (Read time)
  // 0.35 - 0.7: Cards move to center
  // 0.7 - 0.8: Merge / Explosion
  // 0.8 - 1.0: Score Reveal & Hold
  
  const moveProgress = SCROLL_MAP(scrollConfig, 0.35, 0.7, 0, 1);
  const isMerged = scrollConfig > 0.75;
  const scoreProgress = isMerged ? SCROLL_MAP(scrollConfig, 0.75, 0.9, 0, 1) : 0;
  
  const cardGap = 200 * (1 - moveProgress); // Starts at 200px gap, goes to 0

  return (
    <section ref={containerRef} className="h-[400vh] relative z-20 bg-background">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
        
        {/* Background Radial Glow */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] transition-all duration-300"
            style={{ opacity: isMerged ? 0.8 : 0.2, transform: isMerged ? 'scale(1.5) translate(-50%, -50%)' : 'scale(1) translate(-50%, -50%)' }}
        />

        <div className="relative z-10 text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">THE MATCH ENGINE</h2>
            <p className="text-muted-foreground text-lg">Comparing skills, experience, and requirements instantly.</p>
        </div>

        <div className="relative flex items-center justify-center h-80 w-full perspective-container">
            
            {/* CARD 1: CANDIDATE */}
            <div 
                className="absolute w-64 h-80 bg-card border border-border rounded-xl shadow-xl flex flex-col items-center justify-center p-6 transition-all duration-100 ease-linear z-10"
                style={{ 
                    transform: `translateX(-${cardGap}px) rotateY(${15 * (1-moveProgress)}deg)`,
                    opacity: isMerged ? 0 : 1 
                }}
            >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                    <User className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Candidate</h3>
                <div className="w-full mt-4 space-y-2">
                    <div className="h-2 bg-blue-500/20 rounded-full w-3/4 mx-auto"></div>
                    <div className="h-2 bg-blue-500/20 rounded-full w-1/2 mx-auto"></div>
                </div>
            </div>

            {/* CARD 2: JOB DESCRIPTION */}
            <div 
                className="absolute w-64 h-80 bg-card border border-border rounded-xl shadow-xl flex flex-col items-center justify-center p-6 transition-all duration-100 ease-linear z-10"
                style={{ 
                    transform: `translateX(${cardGap}px) rotateY(${-15 * (1-moveProgress)}deg)`,
                    opacity: isMerged ? 0 : 1 
                }}
            >
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 text-orange-500">
                    <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Job Req</h3>
                <div className="w-full mt-4 space-y-2">
                    <div className="h-2 bg-orange-500/20 rounded-full w-3/4 mx-auto"></div>
                    <div className="h-2 bg-orange-500/20 rounded-full w-1/2 mx-auto"></div>
                </div>
            </div>

            {/* RESULT: MATCH SCORE (Appears after merge) */}
            <div 
                className="absolute z-20 flex flex-col items-center justify-center"
                style={{ 
                    opacity: isMerged ? 1 : 0, 
                    transform: `scale(${isMerged ? 1 : 0.5})`,
                    transition: 'opacity 0.3s, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-2xl opacity-50 animate-pulse"></div>
                    <div className="relative w-48 h-48 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary),0.5)]">
                        <div className="text-center">
                            <span className="block text-xl font-medium text-muted-foreground uppercase tracking-widest">Match</span>
                            <span className="block text-6xl font-black text-primary">
                                {Math.floor(scoreProgress * 98)}%
                            </span>
                        </div>
                    </div>
                    {/* Floating Badges */}
                    <div className="absolute -top-4 -right-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-float-medium delay-100">
                        Top 5%
                    </div>
                    <div className="absolute -bottom-4 -left-10 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 animate-float-medium delay-300">
                        <Zap className="w-3 h-3" /> Instant
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}

// Helper to map scroll range to value range
function SCROLL_MAP(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    if (value < inMin) return outMin;
    if (value > inMax) return outMax;
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
