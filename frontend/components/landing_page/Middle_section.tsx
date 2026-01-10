"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  CheckSquareIcon, 
  ClockIcon, 
  FileTextIcon, 
  FileWarningIcon,
  ArrowRightIcon,
  ZapIcon,
  TargetIcon,
  TrendingUpIcon
} from "lucide-react";
import SectionHeader from "../common/section_header";
import { useEffect, useRef, useState } from "react";

// Hook for horizontal scroll logic
const useHorizontalScroll = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scrollX, setScrollX] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            
            const rect = containerRef.current.getBoundingClientRect();
            const offsetTop = rect.top;
            
            // Start scrolling when the top hits 0
            // Scroll distance is determined by container height (400vh)
            const maxScroll = containerRef.current.scrollHeight - window.innerHeight;
            
            // How far have we scrolled into the section?
            // rect.top is 0 when we just hit it. rect.top is negative as we scroll past.
            const scrolledInto = -offsetTop;
            
            // Map vertical scroll to horizontal transform
            // We want to move from 0 to -width
            if (scrolledInto > 0 && scrolledInto < maxScroll) {
                setScrollX(scrolledInto);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return { containerRef, contentRef, scrollX };
};

const problemCards = [
  {
    icon: <ClockIcon className="h-8 w-8 text-primary" />,
    title: "Time-Consuming Reviews",
    description: "Recruiters spend hours manually reviewing each resume, slowing down the entire hiring process."
  },
  {
    icon: <FileTextIcon className="h-8 w-8 text-primary" />,
    title: "Format Inconsistency",
    description: "Resume formats vary widely across PDFs, documents, and different layouts making extraction difficult."
  },
  {
    icon: <CheckSquareIcon className="h-8 w-8 text-primary" />,
    title: "Inaccurate Matching",
    description: "Matching skills to job requirements manually leads to inconsistent and biased evaluations."
  },
  {
    icon: <FileWarningIcon className="h-8 w-8 text-primary" />,
    title: "Missed Talent",
    description: "Top candidates are often overlooked due to human error in manual screening processes."
  }
];

export function MiddleSection() {
  const { containerRef, contentRef, scrollX } = useHorizontalScroll();
  
  return (
    <section>
        {/* Horizontal Scroll Section - "The Problems" */}
        <div ref={containerRef} className="horizontal-scroll-section">
            <div className="horizontal-scroll-container bg-muted/20">
                <div className="pl-12 lg:pl-24 pr-12">
                    <h2 className="text-massive leading-none mb-4">THE<br/>PROBLEM</h2>
                    <p className="text-xl text-muted-foreground">Why traditional hiring is broken.</p>
                </div>
                
                <div ref={contentRef} className="horizontal-scroll-content" style={{ transform: `translateX(-${scrollX}px)` }}>
                    {problemCards.map((card, index) => (
                        <div key={index} className="w-[80vw] sm:w-[50vw] lg:w-[35vw] h-[60vh] flex-shrink-0 perspective-container">
                            <Card className="h-full w-full bg-card border-2 hover:border-primary/50 transition-all duration-500 overflow-hidden group 
                                             preserve-3d hover:shadow-2xl hover:-translate-y-4 hover:rotate-2 will-change-transform"
                                  style={{ transform: 'skewX(-2deg)' }} // Kinetic skew
                            >
                                <CardContent className="h-full flex flex-col justify-between p-10 bg-gradient-to-br from-card to-muted/20">
                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 shadow-sm">
                                        {card.icon}
                                    </div>
                                    <div className="transform transition-transform duration-500 group-hover:translate-x-2">
                                        <h3 className="text-3xl font-bold mb-4">{card.title}</h3>
                                        <p className="text-lg text-muted-foreground leading-relaxed">{card.description}</p>
                                    </div>
                                    <div className="w-full h-1 bg-muted group-hover:bg-primary/20 transition-colors rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-1000 ease-out" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                    
                    {/* Bridge to next section */}
                    <div className="w-[80vw] h-[60vh] flex flex-col justify-center flex-shrink-0 animate-pulse">
                        <h3 className="text-6xl font-bold text-primary">Until Now.</h3>
                        <ArrowRightIcon className="w-24 h-24 mt-8 text-primary" />
                    </div>
                </div>
            </div>
        </div>

        {/* Regular Scroll Section - "The Solution" (Standard cinematic) */}
        <div className="py-32 section-cinematic items-center justify-center flex flex-col">
            <div className="wrapper text-center mb-20">
                <h2 className="text-massive leading-none mb-6">THE<br/>SOLUTION</h2>
                <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
                    Experience the future of recruitment with AI-driven insights.
                </p>
            </div>

            <div className="wrapper grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="p-8 border bg-card rounded-2xl hover:translate-y-[-10px] transition-transform duration-300">
                    <ZapIcon className="w-12 h-12 text-primary mb-6" />
                    <h3 className="text-2xl font-bold mb-3">Instant Parsing</h3>
                    <p className="text-muted-foreground">Upload any resume and get structured data seconds later.</p>
                 </div>
                 <div className="p-8 border bg-card rounded-2xl hover:translate-y-[-10px] transition-transform duration-300 delay-100">
                    <TargetIcon className="w-12 h-12 text-primary mb-6" />
                    <h3 className="text-2xl font-bold mb-3">Smart Matching</h3>
                    <p className="text-muted-foreground">Automatically score candidates against your job descriptions.</p>
                 </div>
                 <div className="p-8 border bg-card rounded-2xl hover:translate-y-[-10px] transition-transform duration-300 delay-200">
                    <TrendingUpIcon className="w-12 h-12 text-primary mb-6" />
                    <h3 className="text-2xl font-bold mb-3">Data Driven</h3>
                    <p className="text-muted-foreground">Make decisions based on skills and facts, not just gut feeling.</p>
                 </div>
            </div>
            
            <div className="mt-24">
                <Button size="lg" className="h-16 px-12 text-xl rounded-full glow-primary hover:scale-105 transition-transform">
                    Start For Free
                </Button>
            </div>
        </div>
    </section>
  )
}
