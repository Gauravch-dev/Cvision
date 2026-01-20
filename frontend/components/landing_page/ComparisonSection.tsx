"use client";

import { useRef, useEffect, useState } from "react";
import { CheckCircle2, XCircle, FileText, ScanLine, AlertTriangle, Clock, X, Check } from "lucide-react";
import { Badge } from "../ui/badge";

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
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
             {/* Randomly rotated papers */}
             {[...Array(8)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute w-64 h-80 bg-background border border-border shadow-md transition-transform duration-1000"
                    style={{
                        top: `${20 + (i * 10)}%`,
                        left: `${10 + (i * 15)}%`,
                        // Use deterministic rotation to avoid hydration mismatches
                        // ((i * 17) % 41) - 20 gives a pseudo-random looking value between -20 and 20
                        transform: `rotate(${((i * 17) % 41) - 20}deg) translateZ(-${i * 10}px)`,
                    }}
                />
             ))}
             
             {/* Floating X Icons for chaos */}
             <XCircle className="absolute top-[10%] right-[30%] w-32 h-32 text-destructive/5 animate-pulse-slow" />
             <AlertTriangle className="absolute bottom-[20%] left-[10%] w-24 h-24 text-muted-foreground/10" />
          </div>

          <div 
            className="relative z-10 max-w-lg p-10 text-center sm:text-left transition-all duration-700 will-change-transform bg-background/60 backdrop-blur-md rounded-3xl border border-destructive/10 shadow-2xl"
             style={{ 
                transform: `scale(${1 - revealProgress * 0.3}) translateX(${revealProgress * -100}px)`, 
                opacity: 1 - revealProgress * 1.5,
                filter: `blur(${revealProgress * 20}px) grayscale(${revealProgress * 100}%)`
             }}
          >
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-destructive/10 text-destructive mb-8 shadow-sm">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-massive text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-tighter leading-none drop-shadow-sm">
                THE<br/>OLD WAY
            </h3>
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-background/80 backdrop-blur-xl rounded-xl border border-destructive/20 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <X className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground">Manual Review</h4>
                        <p className="text-muted-foreground text-sm font-medium">Hours spent reading resumes 1-by-1.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-background/80 backdrop-blur-xl rounded-xl border border-destructive/20 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <X className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground">Unconscious Bias</h4>
                        <p className="text-muted-foreground text-sm font-medium">Decisions based on gut, not data.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-background/80 backdrop-blur-xl rounded-xl border border-destructive/20 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <X className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground">Slow & Painful</h4>
                        <p className="text-muted-foreground text-sm font-medium">Average 45 days to hire.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE: Cvision Way (Clean/Holographic) 
           ========================================= */}
        <div className="absolute inset-0 pointer-events-none flex justify-end">
             {/* The "New" Layer - Expands from Right */}
             <div 
                className="h-full bg-foreground border-l border-primary/50 relative overflow-hidden shadow-[0_0_100px_rgba(var(--primary),0.3)]"
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
                {/* Holographic Grid Background - AMAZING ANIMATION */}
                <div className="absolute inset-0 z-0 opacity-10" 
                     style={{ 
                         backgroundImage: 'linear-gradient(to right, rgba(var(--primary), 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--primary), 0.2) 1px, transparent 1px)',
                         backgroundSize: '40px 40px',
                         transform: 'perspective(500px) rotateX(20deg)',
                         transformOrigin: 'top center'
                     }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                
                {/* Animated Scanning Line */}
                <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-primary/0 via-primary/20 to-primary/0 animate-scan-line pointer-events-none mix-blend-screen" 
                     style={{ animation: 'scan 3s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}
                />

                <div className="relative z-10 w-screen h-full flex items-center justify-center md:justify-end md:pr-[10vw]">
                    <div className="max-w-xl p-8 text-center sm:text-right">
                        <Badge className="mb-6 bg-primary/20 text-primary border-primary/50 hover:bg-primary/30 px-4 py-1 text-base">
                            The Future of Hiring
                        </Badge>
                        
                        <h3 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-background drop-shadow-[0_0_30px_rgba(var(--primary),0.5)] leading-[0.9]">
                            CVISION<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">AI CORE</span>
                        </h3>
                        
                        <div className="space-y-6 inline-block text-left w-full max-w-md">
                             <div className="group flex items-center gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors animate-fade-in-right" style={{ animationDelay: '0.1s' }}>
                                <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                                    <ScanLine className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-background text-lg">Instant Parsing</h4>
                                    <p className="text-muted-foreground">Extracts 100+ data points in seconds.</p>
                                </div>
                             </div>

                             <div className="group flex items-center gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors animate-fade-in-right" style={{ animationDelay: '0.2s' }}>
                                <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-background text-lg">Data-Driven</h4>
                                    <p className="text-muted-foreground">Matches based on semantic understanding.</p>
                                </div>
                             </div>

                             <div className="group flex items-center gap-5 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
                                <div className="p-3 rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-background text-lg">Zero Bias</h4>
                                    <p className="text-muted-foreground">Focuses purely on skills and experience.</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
        
        {/* Vertical Divider during transition */}
        {!isMobile && (
            <div 
                className="absolute top-0 bottom-0 w-[4px] bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_30px_rgba(var(--primary),1)] z-50 pointer-events-none"
                style={{ 
                    right: `${revealProgress * 100}%`,
                    display: revealProgress <= 0 || revealProgress >= 1 ? 'none' : 'block'
                }} 
            />
        )}
        
      </div>
      
      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes fade-in-right {
             from { opacity: 0; transform: translateX(20px); }
             to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
            animation: fade-in-right 0.5s ease-out forwards;
            opacity: 0; 
        }
      `}</style>
    </section>
  );
}
