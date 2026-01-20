"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { SparklesIcon, FileTextIcon, CheckCircleIcon, StarIcon, PlayCircleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMousePosition } from "@/hooks/useScrollEffects";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

// Floating 3D Resume Document (Enhanced Scale & Visuals)
const FloatingResume = ({ scale = 1, opacity = 1, tiltX = 0, tiltY = 0 }: { scale?: number, opacity?: number, tiltX?: number, tiltY?: number }) => {
  return (
    <div 
      className="perspective-container origin-center will-change-transform transition-transform duration-700 ease-out"
      style={{ 
        transform: `scale(${scale}) rotateX(${tiltY * 20}deg) rotateY(${tiltX * 20}deg)`, 
        opacity: opacity 
      }}
    >
      <div
        className="relative preserve-3d w-[22rem] h-[32rem] lg:w-[30rem] lg:h-[42rem]" 
        style={{
          transform: `rotateY(-15deg) rotateX(5deg)`,
        }}
      >
        {/* Main Resume Document */}
        <div className="w-full h-full bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl glow-elevated relative overflow-hidden flex flex-col shadow-2xl transition-all duration-300">
             {/* Holographic Sheen - Monochrome */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-foreground/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
             
          {/* Header bar */}
          <div className="h-24 border-b border-border/50 p-8 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                    <FileTextIcon className="w-7 h-7 text-primary" />
                </div>
                <div>
                    <div className="text-lg font-bold text-foreground tracking-tight">Alex Morgan</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sr. Full Stack Dev</div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-1">
                 <div className="text-xs font-mono text-muted-foreground/60">ID: #8X92</div>
                 <Badge variant="outline" className="text-[10px] h-5 border-primary/20 text-primary bg-primary/5">Verified</Badge>
            </div>
          </div>
          
          {/* Content lines */}
          <div className="p-8 space-y-6 flex-1 bg-gradient-to-b from-transparent to-black/5">
            <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Professional Summary</div>
                <p className="text-sm text-foreground/80 leading-relaxed font-light">
                    Passionate developer with 7+ years of experience building scalable web applications. Expert in React ecosystem and cloud architecture.
                </p>
            </div>
            
            <div className="pt-4 space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Experience</div>
              <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                      <div className="text-sm font-bold text-foreground">TechLead @ FutureCorp</div>
                      <div className="text-xs text-muted-foreground">Architected microservices for 1M+ users.</div>
                  </div>
              </div>
              <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                  <div>
                      <div className="text-sm font-bold text-foreground">Senior Dev @ Innovate</div>
                      <div className="text-xs text-muted-foreground">Led frontend migration to Next.js.</div>
                  </div>
              </div>
            </div>
            
            <div className="pt-6">
              <div className="h-4 bg-foreground/10 rounded w-1/2 mb-4"></div>
              <div className="flex gap-3 flex-wrap">
                {["React", "TypeScript", "Node.js", "AI", "Python"].map((skill, i) => (
                    <div key={i} className="h-8 px-3 rounded-md bg-primary/5 border border-primary/10 flex items-center">
                        <span className="text-xs font-semibold text-primary">{skill}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Match score badge - Monochrome/Primary */}
          <div 
             className="absolute -top-6 -right-6 w-28 h-28 bg-primary rounded-full flex flex-col items-center justify-center glow-primary animate-pulse-3d z-20 border-4 border-background shadow-xl"
             style={{ transform: `translateZ(60px)` }}
          >
            <span className="text-primary-foreground font-black text-3xl">98%</span>
            <span className="text-xs text-primary-foreground/80 font-bold uppercase tracking-widest">Match</span>
          </div>
        </div>

        {/* Floating details - Monochrome/Primary */}
        <div 
            className="absolute -left-24 top-20 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl px-5 py-4 glow-soft animate-float-medium transition-transform duration-300 shadow-xl" 
            style={{ animationDelay: "0.5s", transform: `translateZ(80px) translateX(${tiltX * -30}px)` }}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
                 <CheckCircleIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <span className="block text-sm font-bold text-foreground">Auto-Parsed</span>
                <span className="block text-xs text-muted-foreground">0.02s latency</span>
            </div>
          </div>
        </div>

        <div 
            className="absolute -right-12 bottom-32 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl px-5 py-4 glow-soft animate-float-medium transition-transform duration-300 shadow-xl" 
            style={{ animationDelay: "1s", transform: `translateZ(100px) translateX(${tiltX * -50}px)` }}
        >
          <div className="flex items-center gap-4">
             <div className="p-2 bg-primary/10 rounded-lg">
                <StarIcon className="w-6 h-6 text-primary fill-primary/20" />
            </div>
             <div>
                <span className="block text-sm font-bold text-foreground">Top Talent</span>
                <span className="block text-xs text-muted-foreground">Recommended</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { normalizedX, normalizedY } = useMousePosition();

  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleScroll = useDebouncedCallback(() => {
    if (!containerRef.current) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const containerHeight = containerRef.current.offsetHeight;
    
    const scrollableDistance = containerHeight - windowHeight;
    const rawProgress = scrollY / scrollableDistance;
    const progress = Math.min(Math.max(rawProgress, 0), 1);
    
    setScrollProgress(progress);
  }, 16); // ~60fps

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Visual Transformations based on scroll (respect reduced motion)
  const animationMultiplier = prefersReducedMotion ? 0.3 : 1;
  const contentOpacity = 1 - scrollProgress * 2.5 * animationMultiplier;
  const scaleValue = 0.9 + scrollProgress * 0.4 * animationMultiplier;
  const moveX = scrollProgress * -25 * animationMultiplier;

  return (
    <>
      <div className="hero-scroll-wrapper h-[300vh] relative" ref={containerRef}>
        <div className="sticky-hero flex items-center justify-center overflow-hidden h-screen w-full sticky top-0">
          
          {/* Detail: Subtle Noise & Shapes - Monochrome */}
          <div className="absolute inset-0 z-0 bg-background">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
               {/* Gradient Orbs - Primary/Muted only */}
               <div 
                  className="absolute top-[-20%] left-[20%] w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow"
                  style={{ transform: `translate(${normalizedX * 20}px, ${normalizedY * 20}px)` }} 
               />
               <div 
                  className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-muted-foreground/5 rounded-full blur-[150px] animate-pulse-slow delay-1000"
                  style={{ transform: `translate(${normalizedX * -20}px, ${normalizedY * -20}px)` }}
               />
          </div>

          <div className="wrapper relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full px-6 lg:px-12">
            
            {/* Text Content */}
            <div 
              className="flex flex-col items-center lg:items-start text-center lg:text-left pt-20 lg:pt-0 translation-all duration-300 ease-out"
              style={{ 
                opacity: Math.max(contentOpacity, 0),
                transform: `translateY(${scrollProgress * -50}px) scale(${1 - scrollProgress * 0.1})`,
                filter: `blur(${scrollProgress * 20}px)`,
                pointerEvents: contentOpacity <= 0 ? 'none' : 'auto'
              }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-xl mb-8 animate-fade-in-up">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Cvision 2.0 Live</span>
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8 text-foreground animate-fade-in-up delay-100 drop-shadow-sm">
                HIRE<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-foreground drop-shadow-md">SMARTER.</span>
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-xl leading-relaxed font-light animate-fade-in-up delay-200">
                The AI-powered recruitment engine that reads resumes like a human, but at machine speed.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto animate-fade-in-up delay-300">
                <Button asChild size="lg" className="h-14 px-8 w-full sm:w-auto text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-primary-foreground">
                  <Link href="/sign-in">
                    <SparklesIcon className="size-5 mr-2" />
                    Start Screening
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="h-14 px-8 w-full sm:w-auto text-lg rounded-full border-border hover:bg-muted/50 transition-all duration-300 group">
                  <Link href="/sign-up">
                     <PlayCircleIcon className="size-5 mr-2 group-hover:text-primary transition-colors" />
                     Get Started
                  </Link>
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-4 text-sm text-muted-foreground animate-fade-in-up delay-500">
                  <div className="flex -space-x-4">
                      {[
                        "/logos/google.png",
                        "/logos/microsoft.jpeg",
                        "/logos/amazon.png", 
                        "/logos/apple.png"
                      ].map((logo, i) => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-white flex items-center justify-center overflow-hidden z-10 hover:z-20 transition-all hover:scale-110 shadow-sm">
                             <img src={logo} alt="Company Logo" className="w-full h-full object-contain p-2" />
                          </div>
                      ))}
                  </div>
                  <p>Trusted by <span className="text-foreground font-bold">500+</span> companies</p>
              </div>
            </div>

            {/* 3D Visual */}
            <div 
              className="flex items-center justify-center relative h-[600px] lg:h-auto will-change-transform"
              style={{ 
                transform: `translateX(${moveX}vw) scale(${scaleValue})`,
                zIndex: 20
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-[100px] rounded-full opacity-40 animate-pulse-3d mix-blend-multiply" 
                  style={{ transform: 'scale(1.2)' }}
              />
              {/* Pass mouse tilt values - Enhanced interaction (disabled on mobile/reduced motion) */}
              <FloatingResume 
                  scale={0.9}
                  opacity={1} 
                  tiltX={(scrollProgress < 0.2 && isHovering && !isMobile && !prefersReducedMotion) ? normalizedX * 1.5 : 0} 
                  tiltY={(scrollProgress < 0.2 && isHovering && !isMobile && !prefersReducedMotion) ? normalizedY * 1.5 : 0} 
              />
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
}