"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, FileText, CheckCircle, Search, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HowItWorksSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: 1,
            title: "Upload Resume",
            desc: "Drag & drop candidates' resumes. We handle PDF, DOCX, and more.",
            icon: <Upload className="w-6 h-6" />,
            visual: "upload"
        },
        {
            id: 2,
            title: "AI Analysis",
            desc: "Our engine scans for skills, experience, and nuanced context.",
            icon: <Search className="w-6 h-6" />,
            visual: "scan"
        },
        {
            id: 3,
            title: "Instant Match",
            desc: "Get a ranked list of best-fit candidates instantly.",
            icon: <UserCheck className="w-6 h-6" />,
            visual: "match"
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const triggerPoint = window.innerHeight * 0.5;
            
            // Simple scroll spy logic
            if (rect.top < triggerPoint && rect.bottom > 0) {
                const progress = Math.abs(rect.top) / rect.height;
                const currentStep = Math.min(steps.length - 1, Math.floor(progress * 3)); // 3 is roughly the multiplier for steps
                // Actually let's just use time-based cycling when visible
            }
        };
        
        // Auto-cycle steps when in view
        const interval = setInterval(() => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                if (isVisible) {
                    setActiveStep(prev => (prev + 1) % steps.length);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
                        How <span className="text-primary">It Works</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Three simple steps to revolutionize your hiring process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left: Steps List */}
                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <div 
                                key={index}
                                className={`flex items-start gap-6 p-6 rounded-2xl transition-all duration-500 cursor-pointer ${
                                    activeStep === index 
                                        ? "bg-primary/5 border border-primary/20 shadow-lg scale-105" 
                                        : "opacity-50 hover:opacity-100 hover:bg-muted/50"
                                }`}
                                onClick={() => setActiveStep(index)}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                                    activeStep === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                }`}>
                                    {step.icon}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 transition-colors ${
                                        activeStep === index ? "text-foreground" : "text-muted-foreground"
                                    }`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Animated Visuals */}
                    <div className="h-[500px] bg-card border border-border rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary),0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary),0.03)_1px,transparent_1px)] bg-size-[20px_20px]" />
                        
                        {/* Step 1: Upload Animation */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                            activeStep === 0 ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                        }`}>
                            <div className="relative w-64 h-80 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm animate-pulse">
                                <FileText className="w-16 h-16 text-primary mb-4 animate-bounce" />
                                <p className="text-sm font-bold text-primary">Drop Resume Here</p>
                            </div>
                            {/* Draggable File */}
                            <div className="absolute w-40 h-52 bg-white text-black p-4 rounded shadow-xl border rotate-6 animate-float-slow">
                                <div className="h-2 bg-gray-200 w-1/2 mb-2" />
                                <div className="space-y-2">
                                    <div className="h-1 bg-gray-100 w-full" />
                                    <div className="h-1 bg-gray-100 w-full" />
                                    <div className="h-1 bg-gray-100 w-3/4" />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Analysis Animation */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                            activeStep === 1 ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                        }`}>
                            <div className="relative w-80 h-80 rounded-full border border-primary/20 animate-spin-reverse-slow" />
                            <div className="absolute w-60 h-60 rounded-full border border-primary/40 animate-spin-slow" />
                            
                            <div className="relative z-10 bg-background/80 backdrop-blur-xl border border-primary/50 p-6 rounded-2xl shadow-2xl text-center">
                                <Search className="w-10 h-10 text-primary mx-auto mb-3 animate-pulse" />
                                <div className="space-y-2 w-48 mx-auto">
                                    <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary animate-progress" style={{ width: '100%' }} />
                                    </div>
                                    <p className="text-xs text-primary font-mono">Analyzing Skills...</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Match Animation */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${
                            activeStep === 2 ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                        }`}>
                            <div className="relative">
                                {/* Success Burst */}
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                                
                                <div className="relative bg-card border border-primary rounded-2xl p-6 shadow-[0_0_50px_rgba(var(--primary),0.3)] text-center transform hover:scale-105 transition-transform">
                                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground">
                                        <span className="text-3xl font-black">98%</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">Top Match</h3>
                                    <p className="text-muted-foreground text-sm">Perfect candidate found!</p>
                                    
                                    <Button className="mt-4 w-full" size="sm">
                                        View Profile <ArrowRight className="w-3 h-3 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 2s ease-out infinite;
                }
            `}</style>
        </section>
    );
}
