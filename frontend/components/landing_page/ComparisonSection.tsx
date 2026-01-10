"use client";

import { useRef, useEffect, useState } from "react";
import { CheckCircle2, XCircle, FileText, ScanLine } from "lucide-react";

export function ComparisonSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const height = sectionRef.current.clientHeight;
      const windowHeight = window.innerHeight;
      
      const start = windowHeight;
      const end = -height + windowHeight;
      
      let newProgress = (start - rect.top) / (start - end);
      newProgress = Math.max(0, Math.min(1, newProgress));
      
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calculate reveal progress with a buffer
  // 0% to 20% scroll: Progress is 0 (Old Way visible)
  // 20% to 100% scroll: Progress goes from 0 to 1 (New Way reveals)
  // Making the window slightly larger (0.8 divider) for smoother control
  const revealProgress = Math.max(0, (progress - 0.2) / 0.8);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-background">
      <div className="sticky top-0 h-screen w-full flex overflow-hidden">
        
        {/* =========================================
            LEFT SIDE: The Old Way (Chaotic/Messy) 
           ========================================= */}
        <div 
          className="relative h-full w-full bg-muted/30 flex items-center justify-center overflow-hidden"
        >
          {/* 3D Messy Paper Background Elements */}
          <div className="absolute inset-0 z-0 opacity-10 md:opacity-20 pointer-events-none">
             {/* Randomly rotated papers */}
             <div className="absolute top-[20%] left-[10%] w-64 h-80 bg-white border border-gray-400 rotate-[-12deg] shadow-xl" />
             <div className="absolute top-[30%] left-[20%] w-64 h-80 bg-white border border-gray-400 rotate-[8deg] shadow-xl" />
             <div className="absolute top-[15%] left-[30%] w-64 h-80 bg-white border border-gray-400 rotate-[-5deg] shadow-xl" />
             <div className="absolute bottom-[20%] right-[20%] w-64 h-80 bg-white border border-gray-400 rotate-[15deg] shadow-xl" />
             <div className="absolute bottom-[10%] left-[15%] w-64 h-80 bg-white border border-gray-400 rotate-[-8deg] shadow-xl" />
             
             {/* Floating X Icons for chaos */}
             <XCircle className="absolute top-[10%] right-[30%] w-24 h-24 text-destructive/20 animate-float-slow" style={{ animationDelay: '0s' }} />
             <XCircle className="absolute bottom-[30%] left-[10%] w-16 h-16 text-destructive/20 animate-float-slow" style={{ animationDelay: '2s' }} />
          </div>

          <div 
            className="relative z-10 max-w-md p-8 text-center sm:text-left transition-all duration-500 will-change-transform"
             style={{ 
                transform: `scale(${1 - revealProgress * 0.2}) translateX(${revealProgress * -50}px)`, 
                opacity: 1 - revealProgress * 0.8,
                filter: `blur(${revealProgress * 10}px)` 
             }}
          >
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-destructive/10 text-destructive mb-8 shadow-sm">
              <FileText className="w-10 h-10" />
            </div>
            <h3 className="text-massive text-5xl md:text-7xl font-bold mb-6 text-muted-foreground tracking-tighter">THE<br/>OLD WAY</h3>
            <ul className="space-y-6 text-2xl text-muted-foreground/80 font-medium">
              <li className="flex items-center gap-4">
                <XCircle className="w-6 h-6 shrink-0 text-destructive" /> Manual Review
              </li>
              <li className="flex items-center gap-4">
                <XCircle className="w-6 h-6 shrink-0 text-destructive" /> Unconscious Bias
              </li>
              <li className="flex items-center gap-4">
                <XCircle className="w-6 h-6 shrink-0 text-destructive" /> Slow & Painful
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE: Cvision Way (Clean/Holographic) 
           ========================================= */}
        <div className="absolute inset-0 pointer-events-none flex justify-end">
             {/* The "New" Layer - Expands from Right */}
             <div 
                className="h-full bg-background border-l border-primary/50 relative overflow-hidden shadow-2xl"
                style={{ 
                    // SSR Safe: Default to 0% initially implies hidden.
                    // Logic: Starts at 0% width. Expands to 100% width.
                    // On Mobile: It's an overlay opacity transition instead of width.
                    width: isMobile ? '100%' : `${revealProgress * 100}%`,
                    opacity: isMobile ? (revealProgress > 0.1 ? 1 : 0) : 1,
                    pointerEvents: revealProgress > 0.1 ? 'auto' : 'none',
                    transition: isMobile ? 'opacity 0.5s ease' : 'none' // Smooth opacity on mobile
                }}
             >
                {/* Holographic Grid Background */}
                <div className="absolute inset-0 z-0 opacity-10" 
                     style={{ 
                         backgroundImage: 'linear-gradient(to right, #8882 1px, transparent 1px), linear-gradient(to bottom, #8882 1px, transparent 1px)',
                         backgroundSize: '50px 50px'
                     }} 
                />
                
                {/* Animated Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/0 via-primary/10 to-primary/0 animate-scan-line pointer-events-none" 
                     style={{ animation: 'scan 4s linear infinite' }}
                />

                <div className="relative z-10 w-screen h-full flex items-center justify-center md:justify-end md:pr-[10vw]">
                    <div className="max-w-xl p-8 text-center sm:text-right">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary mb-8 animate-pulse-3d shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                            <ScanLine className="w-12 h-12" />
                        </div>
                        <h3 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-foreground drop-shadow-2xl leading-[0.9]">
                            CVISION<br /><span className="text-primary">AI CORE</span>
                        </h3>
                        <ul className="space-y-6 text-2xl font-medium inline-block text-left">
                            <li className="flex items-center gap-4">
                                <CheckCircle2 className="w-7 h-7 shrink-0 text-primary" /> 
                                <span>Instant Parsing</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <CheckCircle2 className="w-7 h-7 shrink-0 text-primary" /> 
                                <span>Data-Driven Scores</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <CheckCircle2 className="w-7 h-7 shrink-0 text-primary" /> 
                                <span>Bias-Free Match</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <CheckCircle2 className="w-7 h-7 shrink-0 text-primary" /> 
                                <span>Top Talent 1st</span>
                            </li>
                        </ul>
                    </div>
                </div>
             </div>
        </div>
        
        {/* Vertical Divider during transition */}
        {!isMobile && (
            <div 
                className="absolute top-0 bottom-0 w-[2px] bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)] z-50 pointer-events-none"
                style={{ 
                    right: `${revealProgress * 100}%`,
                    display: revealProgress <= 0 || revealProgress >= 1 ? 'none' : 'block'
                }} 
            />
        )}
        
      </div>
      
      {/* Global Styles for Scan Animation (Using style tag since we can't easily modify globals.css in this step without extra tools) */}
      <style jsx global>{`
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  );
}
