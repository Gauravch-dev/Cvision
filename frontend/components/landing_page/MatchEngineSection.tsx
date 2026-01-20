"use client";

import { useRef, useEffect, useState } from "react";
import { User, Briefcase, Zap, Star, Check, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";

export function MatchEngineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollConfig, setScrollConfig] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = containerRef.current.clientHeight;
      
      const scrollDist = sectionHeight - windowHeight;
      const currentScroll = -rect.top;
      
      let stickyProgress = currentScroll / scrollDist;
      stickyProgress = Math.min(Math.max(stickyProgress, 0), 1);
      
      setScrollConfig(stickyProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const moveProgress = SCROLL_MAP(scrollConfig, 0.35, 0.7, 0, 1);
  const isMerged = scrollConfig > 0.75;
  const scoreProgress = isMerged ? SCROLL_MAP(scrollConfig, 0.75, 0.9, 0, 1) : 0;
  
  const cardGap = 300 * (1 - moveProgress); 

  return (
    <section ref={containerRef} className="h-[400vh] relative z-20 bg-background overflow-hidden">
      
      {/* Background - Particles / Stars */}
      <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
           {/* Animated Background Particles */}
           <div className="absolute inset-0 overflow-hidden opacity-20">
              {[...Array(20)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute rounded-full bg-primary"
                    style={{
                        width: Math.random() * 4 + 1 + 'px',
                        height: Math.random() * 4 + 1 + 'px',
                        top: Math.random() * 100 + '%',
                        left: Math.random() * 100 + '%',
                        animation: `float ${Math.random() * 10 + 10}s infinite linear`
                    }}
                  />
              ))}
          </div>
      </div>

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Radial Glow */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] transition-all duration-300"
            style={{ 
                opacity: isMerged ? 0.6 : 0.2, 
                transform: isMerged ? 'scale(1.5) translate(-50%, -50%)' : 'scale(1) translate(-50%, -50%)' 
            }}
        />

        <div className="relative z-10 text-center mb-24 transition-all duration-500" 
             style={{ 
                 opacity: isMerged ? 0 : 1,
                 transform: `scale(${isMerged ? 0.9 : 1}) translateY(${isMerged ? -20 : 0}px)`
             }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4 fill-primary" />
                <span>The Engine</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-foreground">THE MATCH ENGINE</h2>
            <p className="text-muted-foreground text-2xl font-light">Comparing skills, experience, and requirements instantly.</p>
        </div>

        <div className="relative flex items-center justify-center h-96 w-full perspective-container">
            
            {/* Magnetic Field Visualization (When close) */}
            {!isMerged && moveProgress > 0.5 && (
                <div className="absolute w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent z-0 animate-pulse" style={{ opacity: moveProgress }} />
            )}

            {/* CARD 1: CANDIDATE - User Persona */}
            <div 
                className="absolute w-72 h-96 bg-card border border-border rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 transition-all duration-100 ease-linear z-10 group"
                style={{ 
                    transform: `translateX(-${cardGap}px) rotateY(${15 * (1-moveProgress)}deg) scale(1.1)`,
                    opacity: isMerged ? 0 : 1,
                    filter: isMerged ? 'blur(10px)' : 'none'
                }}
            >
                <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6 border-4 border-background shadow-lg relative overflow-hidden">
                     <User className="w-12 h-12 text-muted-foreground" />
                     <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent mix-blend-overlay" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Candidate</h3>
                <div className="text-sm text-muted-foreground text-center mb-6">Unstructured Resume Data</div>
                
                <div className="w-full space-y-3">
                    <div className="h-2 bg-primary/20 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-primary/50 w-full animate-pulse"></div>
                    </div>
                    <div className="h-2 bg-primary/20 rounded-full w-3/4 overflow-hidden">
                        <div className="h-full bg-primary/50 w-full animate-pulse delay-75"></div>
                    </div>
                    <div className="h-2 bg-primary/20 rounded-full w-5/6 overflow-hidden">
                        <div className="h-full bg-primary/50 w-full animate-pulse delay-150"></div>
                    </div>
                </div>
            </div>

            {/* CARD 2: JOB DESCRIPTION - System Persona */}
            <div 
                className="absolute w-72 h-96 bg-card border border-border rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 transition-all duration-100 ease-linear z-10 group"
                style={{ 
                    transform: `translateX(${cardGap}px) rotateY(${-15 * (1-moveProgress)}deg) scale(1.1)`,
                    opacity: isMerged ? 0 : 1,
                    filter: isMerged ? 'blur(10px)' : 'none'
                }}
            >
                <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 text-primary shadow-lg relative overflow-hidden">
                    <Briefcase className="w-10 h-10" />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/50" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-foreground">Job Req</h3>
                <div className="text-sm text-muted-foreground text-center mb-6">Structured Requirement</div>
                
                <div className="w-full space-y-3">
                    <div className="h-2 bg-primary/20 rounded-full w-full"></div>
                    <div className="h-2 bg-primary/20 rounded-full w-3/4"></div>
                    <div className="h-2 bg-primary/20 rounded-full w-5/6"></div>
                </div>
            </div>

            {/* RESULT: MATCH SCORE (Appears after merge) */}
            <div 
                className="absolute z-30 flex flex-col items-center justify-center pointer-events-none"
                style={{ 
                    opacity: isMerged ? 1 : 0, 
                    transform: `scale(${isMerged ? 1 : 0.5})`,
                    transition: 'opacity 0.2s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                <div className="relative">
                    {/* Shockwave Rings - Primary */}
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-20 duration-1000" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-20 duration-1000 delay-300" style={{ animationDuration: '2s' }}></div>
                    
                    {/* Rotating Rings */}
                    <div className="absolute -inset-4 border border-dashed border-primary/30 rounded-full animate-spin duration-[10s] linear" />
                    <div className="absolute -inset-8 border border-dotted border-primary/20 rounded-full animate-spin duration-[20s] linear reverse" />

                    <div className="relative w-80 h-80 rounded-full bg-background/80 backdrop-blur-xl border-4 border-primary/50 flex items-center justify-center shadow-[0_0_100px_rgba(var(--primary),0.3)]">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-muted-foreground uppercase tracking-widest mb-2">Score</span>
                            <span className="block text-9xl font-black text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)] tracking-tighter">
                                {Math.floor(scoreProgress * 98)}%
                            </span>
                        </div>
                    </div>
                    
                    {/* Floating Badges - Semantic Colors */}
                    <div 
                        className="absolute -top-10 -right-20 bg-primary text-primary-foreground px-6 py-3 rounded-full text-xl font-bold shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-500 delay-300 fill-mode-forwards opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <Trophy className="w-6 h-6" /> Top 5%
                    </div>
                    
                    <div 
                        className="absolute -bottom-10 -left-20 bg-primary/90 text-primary-foreground px-6 py-3 rounded-full text-xl font-bold shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-500 delay-500 fill-mode-forwards opacity-0"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <Zap className="w-6 h-6" /> Instant
                    </div>

                    <div 
                         className="absolute top-1/2 -right-32 bg-card border border-border text-foreground px-4 py-2 rounded-full text-lg font-bold shadow-md flex items-center gap-2 animate-in slide-in-from-left-5 fade-in duration-500 delay-700 fill-mode-forwards opacity-0"
                         style={{ animationFillMode: 'forwards' }}
                    >
                        <Star className="w-5 h-5 fill-primary text-primary" /> AI Verified
                    </div>
                </div>
                
                <h3 className="mt-20 text-4xl font-bold text-foreground animate-in fade-in slide-in-from-bottom-4 delay-700 duration-700 text-center">
                    Perfect Match Found
                    <span className="block text-lg font-normal text-muted-foreground mt-2">Ready for interview</span>
                </h3>
            </div>

        </div>
      </div>
    </section>
  );
}

function SCROLL_MAP(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    if (value < inMin) return outMin;
    if (value > inMax) return outMax;
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
