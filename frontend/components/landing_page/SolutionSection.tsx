"use client";

import { useRef, useEffect, useState } from "react";
import { Zap, Target, TrendingUp, FileJson, CheckCircle2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SolutionSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate which step is active based on scroll position relative to container
            // Total height = 400vh (1 screen per step + buffer)
            // Steps: 0, 1, 2
            
            const offset = -rect.top;
            const stepHeight = windowHeight;
            
            // Determine active step (0, 1, or 2)
            // Adding a small buffer to switch earlier
            const newStep = Math.floor((offset + windowHeight * 0.3) / stepHeight);
            
            setActiveStep(Math.max(0, Math.min(2, newStep)));
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const steps = [
        {
            id: 0,
            title: "Instant Parsing",
            desc: "Upload any resume and get structured data seconds later.",
            icon: <Zap className="w-8 h-8" />,
            visual: (
                <div className="relative w-full h-full flex items-center justify-center p-10">
                    <div className="relative w-[300px] h-[400px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col p-6 animate-pulse">
                        <div className="w-16 h-16 rounded-full bg-muted mb-6" />
                        <div className="space-y-4">
                            <div className="h-4 bg-muted w-3/4 rounded" />
                            <div className="h-4 bg-muted w-1/2 rounded" />
                            <div className="h-4 bg-muted w-full rounded" />
                            <div className="h-4 bg-muted w-5/6 rounded" />
                        </div>
                        {/* Scanning Line */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary shadow-[0_0_20px_rgba(var(--primary),0.8)] animate-scan opacity-80" />
                    </div>
                    {/* JSON Output */}
                    <div className="absolute -right-10 top-20 bg-primary/10 backdrop-blur-md border border-primary/20 p-6 rounded-xl shadow-xl w-[280px] font-mono text-xs text-primary">
                        <p>{`{`}</p>
                        <p className="pl-4">"skills": ["React", "AI"],</p>
                        <p className="pl-4">"exp": 5,</p>
                        <p className="pl-4 text-green-500">"status": "PARSED"</p>
                        <p>{`}`}</p>
                    </div>
                </div>
            )
        },
        {
            id: 1,
            title: "Smart Matching",
            desc: "Automatically score candidates against your job descriptions.",
            icon: <Target className="w-8 h-8" />,
            visual: (
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Job Req Circles */}
                    <div className="absolute w-[400px] h-[400px] border border-dashed border-primary/30 rounded-full animate-spin-slow" />
                    <div className="absolute w-[600px] h-[600px] border border-dashed border-primary/10 rounded-full animate-spin-reverse-slow" />
                    
                    {/* Central Match */}
                    <div className="bg-card w-64 h-64 rounded-full flex flex-col items-center justify-center border-4 border-primary shadow-[0_0_50px_rgba(var(--primary),0.3)] z-10 scale-up-bounce">
                        <span className="text-6xl font-black text-primary">98%</span>
                        <span className="text-sm uppercase tracking-widest text-muted-foreground mt-2">Match Score</span>
                    </div>
                    
                    {/* Floating Candidates */}
                    <div className="absolute top-20 left-20 bg-card p-3 rounded-lg shadow-lg border flex items-center gap-2 animate-float">
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> Java Dev
                    </div>
                    <div className="absolute bottom-40 right-10 bg-card p-3 rounded-lg shadow-lg border flex items-center gap-2 animate-float delay-700">
                        <Search className="w-5 h-5 text-blue-500" /> Searching...
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Data Driven Decision",
            desc: "Make decisions based on skills and facts, not just gut feeling.",
            icon: <TrendingUp className="w-8 h-8" />,
            visual: (
                <div className="relative w-full h-full flex items-center justify-center perspective-container">
                    <div className="relative w-[500px] h-[400px] preserve-3d" style={{ transform: 'rotateX(20deg) rotateY(-20deg) rotateZ(5deg)' }}>
                         {/* Holographic Base Grid */}
                         <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-primary/20 to-transparent origin-bottom" style={{ transform: 'rotateX(90deg)' }} />
                         <div className="absolute inset-0 border border-primary/20 rounded-xl bg-primary/5 backdrop-blur-sm shadow-[0_0_50px_rgba(var(--primary),0.1)]" />

                         {/* 3D Bar Chart */}
                         <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between h-64 gap-4 px-8 preserve-3d">
                             {[65, 45, 85, 95, 75].map((h, i) => (
                                 <div key={i} className="relative group w-12 preserve-3d transition-all duration-700 hover:scale-110" style={{ height: `${h}%` }}>
                                     {/* Bar Front */}
                                     <div className="absolute inset-0 bg-primary/80 border border-primary/50 rounded-sm shadow-[0_0_15px_rgba(var(--primary),0.5)] group-hover:bg-primary transition-colors" />
                                     {/* Bar Top (Simulated 3D) */}
                                     <div className="absolute w-full h-4 -top-4 bg-primary/50 origin-bottom" style={{ transform: 'rotateX(90deg) skewX(45deg)' }} />
                                     {/* Floating Label */}
                                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                                         {h}%
                                     </div>
                                 </div>
                             ))}
                         </div>
                         
                         {/* Floating Insight Badges */}
                         <div className="absolute top-10 right-10 bg-card/90 backdrop-blur border border-primary/30 px-3 py-2 rounded-lg shadow-lg animate-float-slow z-20" style={{ transform: 'translateZ(40px)' }}>
                             <div className="flex items-center gap-2 text-sm font-bold text-primary">
                                 <Zap className="w-4 h-4" /> Predictive Score: 98%
                             </div>
                         </div>
                         
                         <div className="absolute top-32 left-0 bg-card/90 backdrop-blur border border-destructive/30 px-3 py-2 rounded-lg shadow-lg animate-pulse z-20" style={{ animationDuration: '4s', transform: 'translateZ(60px)' }}>
                             <div className="flex items-center gap-2 text-sm font-bold text-destructive">
                                 <Target className="w-4 h-4" /> Retention Risk: Low
                             </div>
                         </div>

                         {/* Connecting Data Lines (Constellation) */}
                         <svg className="absolute inset-0 pointer-events-none opacity-30">
                             <path d="M100 250 L 180 300 L 260 200 L 340 180 L 420 220" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary animate-pulse" />
                             <circle cx="100" cy="250" r="4" className="fill-primary" />
                             <circle cx="180" cy="300" r="4" className="fill-primary" />
                             <circle cx="260" cy="200" r="4" className="fill-primary" />
                             <circle cx="340" cy="180" r="4" className="fill-primary" />
                             <circle cx="420" cy="220" r="4" className="fill-primary" />
                         </svg>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section ref={containerRef} className="h-[300vh] relative bg-background">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-6 h-full grid grid-cols-2 items-center gap-12">
                    
                    {/* LEFT: Text Content */}
                    <div className="space-y-12 pl-8 z-20">
                        <div>
                            <h2 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
                                THE <br/>
                                <span className="text-primary">SOLUTION</span>
                            </h2>
                            <p className="text-2xl text-muted-foreground font-light max-w-lg">
                                Experience the future of recruitment with AI-driven insights.
                            </p>
                        </div>

                        <div className="space-y-8 relative">
                            {/* Vertical Progress Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border -z-10" />

                             {/* Scroll Progress Indicator */}
                             <div 
                                className="absolute left-[18px] top-4 w-1 bg-primary z-0 transition-all duration-300 ease-out"
                                style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
                             />
                            
                            {steps.map((step, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-start gap-6 transition-all duration-500 ${
                                        activeStep === index ? "opacity-100 scale-100" : "opacity-40 scale-95"
                                    }`}
                                >
                                    <div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-500 bg-background ${
                                            activeStep === index 
                                                ? "border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]" 
                                                : "border-muted text-muted-foreground"
                                        }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-300 ${activeStep === index ? "text-foreground" : "text-muted-foreground"}`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-base md:text-lg text-muted-foreground max-w-md">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Visuals */}
                    <div className="h-full relative flex items-center justify-center">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                                    activeStep === index 
                                        ? "opacity-100 translate-y-0 scale-100 blur-0" 
                                        : index < activeStep 
                                            ? "opacity-0 -translate-y-20 scale-95 blur-sm" 
                                            : "opacity-0 translate-y-20 scale-105 blur-sm" 
                                }`}
                            >
                                {step.visual}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            
            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
                .scale-up-bounce {
                    animation: scale-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes scale-up {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </section>
    );
}
