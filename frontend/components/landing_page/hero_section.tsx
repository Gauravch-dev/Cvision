"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRightIcon, SparklesIcon, FileTextIcon, CheckCircleIcon, StarIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMousePosition } from "@/hooks/useScrollEffects";

// Floating 3D Resume Document (now scalable)
const FloatingResume = ({ scale = 1, opacity = 1, tiltX = 0, tiltY = 0 }: { scale?: number, opacity?: number, tiltX?: number, tiltY?: number }) => {
  return (
    <div 
      className="perspective-container origin-center will-change-transform transition-transform duration-100 ease-out"
      style={{ 
        transform: `scale(${scale}) rotateX(${tiltY * 15}deg) rotateY(${tiltX * 15}deg)`, 
        opacity: opacity 
      }}
    >
      <div
        className="relative preserve-3d w-56 h-72 lg:w-72 lg:h-96"
        style={{
          transform: `rotateY(-15deg) rotateX(5deg)`, // Base rotation
        }}
      >
        {/* Main Resume Document */}
        <div className="w-full h-full bg-card border border-border rounded-lg glow-elevated relative overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          {/* Header bar */}
          <div className="h-20 border-b border-border p-6 flex items-center justify-between bg-muted/20">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <FileTextIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="w-20 h-2 rounded-full bg-border" />
          </div>
          
          {/* Content lines */}
          <div className="p-6 space-y-4 flex-1 bg-gradient-to-br from-card to-muted/10">
            <div className="h-3 bg-foreground/10 rounded w-3/4"></div>
            <div className="h-2 bg-foreground/5 rounded w-full"></div>
            <div className="h-2 bg-foreground/5 rounded w-5/6"></div>
            <div className="h-2 bg-foreground/5 rounded w-4/5"></div>
            
            <div className="pt-4">
              <div className="h-3 bg-primary/20 rounded w-1/2 mb-2"></div>
              <div className="h-2 bg-foreground/5 rounded w-full"></div>
              <div className="h-2 bg-foreground/5 rounded w-3/4"></div>
            </div>
            
            <div className="pt-4">
              <div className="h-3 bg-foreground/10 rounded w-2/3 mb-2"></div>
              <div className="flex gap-2 flex-wrap">
                <div className="h-7 bg-primary/10 rounded px-2 w-16"></div>
                <div className="h-7 bg-primary/10 rounded px-2 w-14"></div>
                <div className="h-7 bg-primary/10 rounded px-2 w-12"></div>
                <div className="h-7 bg-primary/10 rounded px-2 w-20"></div>
              </div>
            </div>
          </div>
          
          {/* Match score badge */}
          <div 
             className="absolute -top-4 -right-4 w-20 h-20 bg-primary/90 backdrop-blur rounded-full flex items-center justify-center glow-primary animate-pulse-3d z-10 border-4 border-background"
             style={{ transform: `translateZ(30px)` }}
          >
            <span className="text-primary-foreground font-bold text-xl">98%</span>
          </div>
        </div>

        {/* Floating skill tags behind */}
        <div 
            className="absolute -left-20 top-12 bg-card/80 backdrop-blur border border-border rounded-lg px-4 py-3 glow-soft animate-float-medium transition-transform duration-300" 
            style={{ animationDelay: "0.5s", transform: `translateZ(50px) translateX(${tiltX * -20}px)` }}
        >
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
            <span className="text-base font-medium">Auto-Parsed</span>
          </div>
        </div>

        <div 
            className="absolute -left-12 bottom-20 bg-card/80 backdrop-blur border border-border rounded-lg px-4 py-3 glow-soft animate-float-medium transition-transform duration-300" 
            style={{ animationDelay: "1s", transform: `translateZ(80px) translateX(${tiltX * -40}px)` }}
        >
          <div className="flex items-center gap-3">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-base font-medium">Perfect Match</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { normalizedX, normalizedY } = useMousePosition();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Calculate progress 0 to 1 based on first 100vh of scroll
      const progress = Math.min(scrollY / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Opacity calculation: fades out as you scroll down
  const contentOpacity = 1 - scrollProgress * 1.5;
  
  // Scale calculation: starts at 1, goes up
  const scaleValue = 1 + scrollProgress * 0.5;

  // Move transform: moves resume to center as you scroll
  const moveX = scrollProgress * -50; // Move left towards center

  return (
    <div className="hero-scroll-wrapper" ref={containerRef}>
      <div className="sticky-hero flex items-center justify-center overflow-hidden">
        {/* Cinematic Noise Overlay applied to hero specifically too for depth */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        {/* Parallax Background Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div 
                className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[100px] transition-transform duration-1000 ease-out"
                style={{ transform: `translate(${normalizedX * 50}px, ${normalizedY * 50}px)` }}
            />
             <div 
                className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-500/5 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
                style={{ transform: `translate(${normalizedX * -30}px, ${normalizedY * -30}px)` }}
            />
        </div>

        <div className="wrapper relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
          
          {/* Text Content - Fades out on scroll */}
          <div 
            className="flex flex-col items-center lg:items-start text-center lg:text-left scale-element"
            style={{ 
              opacity: Math.max(contentOpacity, 0),
              transform: `translateY(${scrollProgress * -50}px) scale(${1 - scrollProgress * 0.1})` 
            }}
          >
            <Badge variant="outline" className="px-6 py-2 mb-8 text-sm backdrop-blur-md uppercase tracking-widest border-primary/20">
              Introducing CVision 2.0
            </Badge>

            <h1 className="text-massive leading-[0.85] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              HIRE<br/>SMARTER
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-lg leading-relaxed font-light">
              The AI-powered recruitment engine that reads resumes like a human, but at machine speed.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/sign-in">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full glow-primary hover:scale-105 transition-transform">
                  <SparklesIcon className="size-5 mr-2" />
                  Start Screening
                </Button>
              </Link>

              <Link href="/sign-in">
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full border-2 hover:bg-muted/50 transition-colors">
                   View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* 3D Visual - Scales up and becomes the focus */}
          <div 
            className="hidden lg:flex items-center justify-center scale-element relative"
            style={{ 
              transform: `translateX(${moveX}%) scale(${scaleValue})`,
              zIndex: 20
            }}
          >
            <div 
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full opacity-30 animate-pulse-3d" 
                style={{ transform: 'scale(1.5)' }}
            />
            {/* Pass mouse tilt values */}
            <FloatingResume 
                scale={1} 
                opacity={1} 
                tiltX={scrollProgress < 0.2 ? normalizedX : 0} // Only tilt when not fully scaled scroll mode
                tiltY={scrollProgress < 0.2 ? normalizedY : 0} 
            />
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce transition-opacity duration-300"
        style={{ opacity: Math.max(1 - scrollProgress * 2, 0) }}
      >
        <span className="text-xs uppercase tracking-[0.2em]">Scroll to Explore</span>
      </div>
    </div>
  );
}