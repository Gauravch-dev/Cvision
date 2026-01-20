"use client";

import { useRef, useEffect, useState } from "react";
import { FileText, Database, Layers, CheckCircle, Code2, Cpu, FileJson } from "lucide-react";
import { Badge } from "../ui/badge";

export function SmartParsingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollConfig, setScrollConfig] = useState({ progress: 0, isVisible: false });

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
      
      setScrollConfig({
        progress: stickyProgress,
        isVisible: stickyProgress > 0 && stickyProgress < 1
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scanPosition = SCROLL_MAP(scrollConfig.progress, 0.35, 0.65, 0, 100);
  const isExtracted = scrollConfig.progress > 0.65;

  return (
    <section ref={containerRef} className="h-[400vh] relative z-20 bg-background">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
        
        {/* Background Grid - Monochrome */}
        <div className="absolute inset-0 z-0 opacity-10" 
            style={{ 
                backgroundImage: 'radial-gradient(circle, var(--foreground) 1px, transparent 1px)',
                backgroundSize: '40px 40px' 
            }} 
        />
        {/* Ambient Glow - Semantic */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT: Introduction Text */}
            <div 
                className="text-left space-y-8 transition-all duration-500"
                style={{ 
                    opacity: 1 - Math.max(0, (scrollConfig.progress - 0.7) * 3),
                    transform: `translateY(${Math.max(0, (scrollConfig.progress - 0.7) * 50)}px)`
                }} 
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium backdrop-blur-md">
                   <Cpu className="w-4 h-4" />
                   <span>AI Powered Extraction</span>
                </div>
                
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-foreground relative">
                    UNSTRUCTURED <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground">TO STRUCTURED</span>
                    {/* Decoding Effect Line */}
                    <div className="absolute -bottom-4 left-0 w-24 h-1 bg-primary rounded-full animate-pulse" />
                </h2>
                
                <p className="text-2xl text-muted-foreground/80 max-w-lg font-light leading-relaxed">
                    Our NLP engine reads PDF & Docx resumes like a human, but at machine speed.
                </p>

                <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-sm">
                         <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                            <FileText className="w-5 h-5" />
                         </div>
                         <div className="flex flex-col">
                             <span className="font-bold text-sm">Input</span>
                             <span className="text-xs text-muted-foreground">PDF / DOCX</span>
                         </div>
                    </div>
                    <div className="h-px w-12 bg-border self-center" />
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
                         <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            <FileJson className="w-5 h-5" />
                         </div>
                         <div className="flex flex-col">
                             <span className="font-bold text-sm text-primary">Output</span>
                             <span className="text-xs text-primary/70">Structured JSON</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* RIGHT (Center Mobile): The Visualization */}
            <div className="relative h-[800px] w-full flex items-center justify-center perspective-container">
                
                {/* 1. Resume Document */}
                <div 
                    className="absolute bg-card border border-border rounded-xl shadow-2xl p-10 w-96 h-[34rem] overflow-hidden transition-all duration-700 ease-out z-10 origin-center"
                    style={{
                        transform: `
                            rotateY(${isExtracted ? -25 : -5}deg) 
                            translateX(${isExtracted ? -180 : 0}px)
                            scale(${isExtracted ? 0.85 : 1})
                        `,
                        filter: isExtracted ? 'blur(1px) grayscale(50%) opacity(0.6)' : 'none',
                        boxShadow: isExtracted ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    {/* Realistic Paper Texture Hint */}
                    <div className="absolute inset-0 bg-linear-to-br from-white/5 to-black/5 pointer-events-none" />
                    
                    {/* Fake Resume Content - Monochrome */}
                    <div className="flex gap-6 mb-8 opacity-80">
                        <div className="w-20 h-20 rounded-full bg-muted animate-pulse border border-border"></div>
                        <div className="flex-1 space-y-3 pt-2">
                            <div className="h-5 bg-foreground/20 rounded w-3/4"></div>
                            <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="space-y-4 opacity-50">
                         {[1,2,3,4,5,6].map(i => (
                             <div key={i} className="h-3 bg-foreground/10 rounded-sm w-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                         ))}
                    </div>
                    
                    <div className="mt-8 space-y-4 opacity-50">
                        <div className="h-4 bg-foreground/20 rounded w-1/3 mb-4"></div>
                         {[1,2,3].map(i => (
                             <div key={i} className="h-3 bg-foreground/10 rounded-sm w-full"></div>
                         ))}
                    </div>

                    {/* Laser Scanner Line - Uses Primary */}
                    {!isExtracted && (
                        <div 
                            className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_50px_5px_rgba(var(--primary),0.8)] z-20 mix-blend-multiply"
                            style={{ top: `${scanPosition}%` }}
                        >
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-32 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
                        </div>
                    )}
                </div>

                {/* 2. Extracted JSON Card - Holographic HUD Style */}
                <div 
                    className="absolute bg-black/80 border border-primary/50 rounded-xl shadow-[0_0_60px_rgba(var(--primary),0.15)] p-0 w-md h-128 font-mono text-sm overflow-hidden z-20 transition-all duration-700 ease-out backdrop-blur-xl"
                    style={{
                        transform: `
                            rotateY(10deg) 
                            translateX(${isExtracted ? 140 : 50}px) 
                            translateZ(60px)
                            scale(${isExtracted ? 1.05 : 0.8})
                        `,
                        opacity: isExtracted ? 1 : 0,
                        visibility: isExtracted ? 'visible' : 'hidden'
                    }}
                >
                    {/* HUD Header */}
                    <div className="bg-primary/10 border-b border-primary/30 p-3 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                            <Layers className="w-3 h-3" />
                            parsed_data_v2.json
                         </div>
                         <div className="flex gap-1.5">
                             <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
                             <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                             <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                         </div>
                    </div>
                    
                    {/* Glowing Content - Semantic Colors */}
                    <div className="p-8 space-y-3 relative text-primary/90 text-xs md:text-sm leading-relaxed">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.05),transparent)] pointer-events-none" />
                        
                        <p className="text-muted-foreground">{"{"}</p>
                        
                        <div className="group pl-4 border-l border-primary/20 hover:border-primary/50 transition-colors">
                            <p><span className="text-primary">"candidate_profile"</span>: {"{"}</p>
                            <p className="pl-4"><span className="text-muted-foreground">"name"</span>: <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">"Alex Doe"</span>,</p>
                            <p className="pl-4"><span className="text-muted-foreground">"role"</span>: <span className="text-white">"Senior Engineer"</span>,</p>
                            <p className="pl-4"><span className="text-muted-foreground">"skills"</span>: [</p>
                            <div className="pl-8 flex flex-wrap gap-2 py-1">
                                <span className="bg-primary/20 px-1 rounded text-primary border border-primary/30">"React"</span>
                                <span className="bg-primary/20 px-1 rounded text-primary border border-primary/30">"Node"</span>
                                <span className="bg-primary/20 px-1 rounded text-primary border border-primary/30">"AWS"</span>
                            </div>
                            <p className="pl-4">],</p>
                            <p className="pl-4"><span className="text-muted-foreground">"exp_years"</span>: <span className="text-white font-bold text-lg">5.5</span></p>
                            <p>{"  }"}</p>
                        </div>

                        <p className="text-muted-foreground">{"}"}</p>
                    </div>

                    {/* HUD Footer status */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/20 bg-primary/5 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold">
                            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                            Processing Complete
                        </div>
                        <div className="text-muted-foreground text-[10px]">98% Confidence</div>
                    </div>
                </div>

                {/* Connection Lines / Data Flow */}
                {isExtracted && (
                    <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">
                        <svg className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="hsl(var(--primary))" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                                <mask id="flowMask">
                                    <path d="M 350 400 C 450 400 550 400 650 400" stroke="white" strokeWidth="2" fill="none">
                                        <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="1.5s" repeatCount="indefinite" />
                                    </path>
                                </mask>
                            </defs>
                            
                            {/* Static Path Line */}
                            <path 
                                d="M 380 400 C 480 380 500 420 600 400" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth="1" 
                                strokeDasharray="4 4"
                                fill="none" 
                                className="opacity-30"
                            />

                            {/* Animated Particle */}
                            <circle r="4" fill="hsl(var(--primary))" className="drop-shadow-[0_0_8px_rgba(var(--primary),1)]">
                                <animateMotion dur="1s" repeatCount="indefinite" path="M 380 400 C 480 380 500 420 600 400" />
                            </circle>
                             <circle r="3" fill="hsl(var(--primary))" className="drop-shadow-[0_0_8px_rgba(var(--primary),1)]" opacity="0.6">
                                <animateMotion dur="1s" begin="0.2s" repeatCount="indefinite" path="M 380 400 C 480 380 500 420 600 400" />
                            </circle>
                        </svg>
                    </div>
                )}

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
