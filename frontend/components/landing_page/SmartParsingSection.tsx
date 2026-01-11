"use client";

import { useRef, useEffect, useState } from "react";
import { FileText, Database, Layers, CheckCircle } from "lucide-react";

export function SmartParsingSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollConfig, setScrollConfig] = useState({ progress: 0, isVisible: false });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = containerRef.current.clientHeight;
      
      // Calculate sticky phase progress
      // Sticky starts when rect.top <= 0
      // Sticky ends when rect.bottom <= windowHeight (or approx rect.top <= -(sectionHeight - windowHeight))
      
      const scrollDist = sectionHeight - windowHeight;
      const currentScroll = -rect.top; // Standardize to positive scroll value from top
      
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

  // Visual phases based on scroll progress (strictly within sticky phase now)
  // 0.0 - 0.35: Read Intro (Pure static hold)
  // 0.35 - 0.65: Scanning
  // 0.65 - 1.0: Extraction & Hold
  const scanPosition = SCROLL_MAP(scrollConfig.progress, 0.35, 0.65, 0, 100);
  const isExtracted = scrollConfig.progress > 0.7;

  return (
    <section ref={containerRef} className="h-[400vh] relative z-20 bg-background">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
        
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20" 
            style={{ 
                backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)',
                backgroundSize: '40px 40px' 
            }} 
        />

        <div className="relative z-10 w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* LEFT: Introduction Text */}
            <div 
                className="text-left space-y-6 transition-opacity duration-500"
                style={{ opacity: 1 - Math.max(0, (scrollConfig.progress - 0.7) * 3) }} // Fades out late (after 0.7)
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
                    <Database className="w-4 h-4" /> Smart Parser
                </div>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
                    UNSTRUCTURED <br/>
                    <span className="text-muted-foreground">TO STRUCTURED</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-md">
                    Our NLP engine reads PDF & Docx resumes like a human, but at machine speed.
                </p>
            </div>

            {/* RIGHT (Center Mobile): The Visualization */}
            <div className="relative h-[600px] w-full flex items-center justify-center perspective-container">
                
                {/* 1. Resume Document */}
                <div 
                    className="absolute bg-card border border-border rounded-xl shadow-2xl p-8 w-80 h-[450px] overflow-hidden transition-all duration-700 ease-out z-10"
                    style={{
                        transform: `
                            rotateY(${isExtracted ? -20 : 0}deg) 
                            translateX(${isExtracted ? -100 : 0}px)
                            scale(${0.9 + scrollConfig.progress * 0.1})
                        `,
                        filter: isExtracted ? 'blur(2px) grayscale(100%)' : 'none',
                        opacity: isExtracted ? 0.5 : 1
                    }}
                >
                    {/* Fake Resume Content */}
                    <div className="flex gap-4 mb-6 opacity-50">
                        <div className="w-16 h-16 rounded-full bg-muted"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-foreground/20 rounded w-3/4"></div>
                            <div className="h-3 bg-foreground/10 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="space-y-3 opacity-30">
                        <div className="h-2 bg-foreground/20 rounded w-full"></div>
                        <div className="h-2 bg-foreground/20 rounded w-full"></div>
                        <div className="h-2 bg-foreground/20 rounded w-5/6"></div>
                        <div className="h-2 bg-foreground/20 rounded w-4/5"></div>
                    </div>

                    {/* Laser Scanner Line */}
                    {!isExtracted && (
                        <div 
                            className="absolute left-0 w-full h-1 bg-primary shadow-[0_0_20px_4px_rgba(var(--primary),0.5)] z-20"
                            style={{ top: `${scanPosition}%` }}
                        />
                    )}
                </div>

                {/* 2. Extracted JSON Card (Appears on right) */}
                <div 
                    className="absolute bg-[#0f1117] border border-primary/30 rounded-xl shadow-2xl p-6 w-80 h-[400px] font-mono text-xs text-green-400 overflow-hidden z-20 transition-all duration-700 ease-out"
                    style={{
                        transform: `
                            rotateY(10deg) 
                            translateX(${isExtracted ? 100 : 50}px) 
                            translateZ(50px)
                        `,
                        opacity: isExtracted ? 1 : 0,
                        visibility: isExtracted ? 'visible' : 'hidden'
                    }}
                >
                    <div className="absolute top-0 left-0 right-0 bg-primary/10 border-b border-primary/20 p-2 flex items-center justify-between">
                         <span className="flex items-center gap-2"><Layers className="w-3 h-3" /> parsed_profile.json</span>
                         <div className="flex gap-1">
                             <div className="w-2 h-2 rounded-full bg-red-500"></div>
                             <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                             <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         </div>
                    </div>
                    <div className="mt-8 space-y-1">
                        <p><span className="text-purple-400">"candidate"</span>: {"{"}</p>
                        <p className="pl-4"><span className="text-blue-400">"name"</span>: <span className="text-yellow-300">"Alex Doe"</span>,</p>
                        <p className="pl-4"><span className="text-blue-400">"role"</span>: <span className="text-yellow-300">"Senior Dev"</span>,</p>
                        <p className="pl-4"><span className="text-blue-400">"skills"</span>: [</p>
                        <p className="pl-8 text-yellow-300">"React", "Node.js",</p>
                        <p className="pl-8 text-yellow-300">"System Design"</p>
                        <p className="pl-4">],</p>
                        <p className="pl-4"><span className="text-blue-400">"experience"</span>: <span className="text-orange-400">5</span></p>
                        <p>{"}"}</p>
                    </div>

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-primary animate-pulse">
                        <CheckCircle className="w-4 h-4" /> Complete
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
