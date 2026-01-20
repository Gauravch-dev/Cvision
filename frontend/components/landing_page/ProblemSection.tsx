"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, FileWarning, SearchX, Ban } from "lucide-react";

export function ProblemSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
             if (!containerRef.current) return;
             // Use similar logic to SolutionSection for consistency
             const rect = containerRef.current.getBoundingClientRect();
             const windowHeight = window.innerHeight;
             const offset = -rect.top;
             const stepHeight = windowHeight;
             const newStep = Math.floor((offset + windowHeight * 0.3) / stepHeight);
             setActiveStep(Math.max(0, Math.min(2, newStep)));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const steps = [
        {
            id: 0,
            title: "Manual Screening Chaos",
            desc: "Recruiters spend 100+ hours manually reviewing resumes, leading to burn out and missed deadlines.",
            icon: <Clock className="w-8 h-8" />,
            visual: (
                 <div className="relative w-full h-full flex items-center justify-center">
                    {/* Floating Papers Chaos */}
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i}
                            className="absolute bg-card border border-border p-4 rounded-lg shadow-xl w-48 h-64 flex flex-col gap-2 animate-float-chaos"
                            style={{
                                animationDelay: `${i * 0.5}s`,
                                left: `${50 + (Math.random() * 40 - 20)}%`,
                                top: `${50 + (Math.random() * 40 - 20)}%`,
                                transform: `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`
                            }}
                        >
                            <div className="w-12 h-12 rounded-full bg-destructive/10 mb-2" />
                            <div className="h-2 bg-muted rounded w-3/4" />
                            <div className="h-2 bg-muted rounded w-1/2" />
                             <div className="h-2 bg-muted rounded w-full mt-4" />
                        </div>
                    ))}
                    <div className="absolute z-10 bg-destructive text-destructive-foreground px-6 py-3 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse">
                        TOO SLOW
                    </div>
                 </div>
            )
        },
        {
            id: 1,
            title: "The Shredder",
            desc: "75% of qualified resumes are rejected by rigid ATS filters that don't understand skills or context.",
            icon: <FileWarning className="w-8 h-8" />,
            visual: (
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Shredder Styles */}
                    <style jsx>{`
                        @keyframes shred-feed {
                            0% { transform: translateY(-100%) scale(0.9); opacity: 0; }
                            10% { opacity: 1; }
                            50% { transform: translateY(0) scale(1); opacity: 1; }
                            100% { transform: translateY(100px) scale(1); opacity: 0; }
                        }
                        @keyframes shred-lines {
                            0% { background-position: 0 0; }
                            100% { background-position: 0 50px; }
                        }
                        @keyframes spark-fly {
                            0% { transform: translate(0, 0) scale(1); opacity: 1; }
                            100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
                        }
                        .animate-shred-feed {
                            animation: shred-feed 2s infinite linear;
                        }
                        .shredder-teeth {
                            background: repeating-linear-gradient(90deg, #111 0px, #111 10px, #333 10px, #333 12px);
                            background-size: 20px 100%;
                        }
                    `}</style>

                    <div className="w-[500px] h-[600px] relative flex flex-col items-center justify-center">
                         {/* Machine Body */}
                         <div className="absolute w-[400px] h-[400px] bg-linear-to-b from-[#1a1a1a] to-black rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center overflow-hidden z-10">
                            {/* Status Light */}
                            <div className="w-full h-16 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-6">
                                <span className="text-white/30 font-mono text-sm tracking-widest">ATS-V1.0</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-destructive font-bold text-xs animate-pulse">REJECTING</span>
                                    <div className="w-2 h-2 rounded-full bg-destructive animate-ping" />
                                </div>
                            </div>
                            
                            {/* Feed Slot */}
                            <div className="mt-12 w-3/4 h-4 bg-black rounded-full shadow-[inset_0_0_20px_rgba(255,0,0,0.5)] border-t border-white/10 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-b from-destructive/20 to-transparent animate-pulse" />
                                <div className="absolute inset-0 top-1 shredder-teeth opacity-50" />
                            </div>
                         </div>
                         
                         {/* Paper Feeding In */}
                        <div className="absolute top-[50px] w-48 h-64 bg-white rounded shadow-lg flex flex-col gap-3 p-4 z-0 animate-shred-feed">
                            <div className="w-12 h-12 rounded-full bg-gray-200 mb-2" />
                            <div className="h-2 bg-gray-200 rounded w-3/4" />
                            <div className="h-2 bg-gray-200 rounded w-full" />
                            <div className="h-2 bg-gray-200 rounded w-5/6" />
                            <div className="h-2 bg-gray-200 rounded w-1/2" />
                        </div>

                         {/* Shredded Remains Falling Out */}
                         <div className="absolute bottom-[80px] w-full flex justify-center gap-1 z-0">
                            {[...Array(8)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="w-4 h-32 bg-white/50 animate-shred-fall"
                                    style={{
                                        animation: `shred-feed 2s infinite linear`,
                                        animationDelay: `${0.2 + Math.random() * 0.1}s`,
                                        width: `${4 + Math.random() * 6}px`,
                                        opacity: 0.5,
                                        transformOrigin: 'top',
                                        clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'
                                    }}
                                />
                            ))}
                         </div>
                         
                         {/* Sparks */}
                         {[...Array(6)].map((_, i) => (
                             <div 
                                key={`spark-${i}`}
                                className="absolute w-1 h-1 bg-destructive rounded-full z-20"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    '--tx': `${(Math.random() - 0.5) * 100}px`,
                                    '--ty': `${(Math.random() + 0.5) * 100}px`,
                                    animation: `spark-fly 0.5s infinite linear`,
                                    animationDelay: `${Math.random()}s`
                                } as any}
                             />
                         ))}
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Bias & Inconsistency",
            desc: "Human fatigue and unconscious bias result in inconsistent evaluations and poor hiring decisions.",
            icon: <Ban className="w-8 h-8" />,
            visual: (
                <div className="relative w-full h-full flex items-center justify-center">
                    <style jsx>{`
                        @keyframes scan-line {
                            0% { top: 0%; opacity: 0; }
                            10% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { top: 100%; opacity: 0; }
                        }
                        @keyframes typing {
                            from { width: 0 }
                            to { width: 100% }
                        }
                        @keyframes blink {
                            50% { opacity: 0; }
                        }
                        .animate-scan {
                             animation: scan-line 3s linear infinite;
                        }
                    `}</style>
                    
                    <div className="relative w-[500px] h-[600px] flex items-center justify-center">
                        {/* Scanner Frame */}
                        <div className="absolute inset-0 border-2 border-white/10 rounded-2xl bg-black/50 backdrop-blur-sm overflow-hidden z-10">
                             {/* Grid Overlay */}
                             <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />
                             
                             {/* Scan Line */}
                             <div className="absolute left-0 w-full h-[2px] bg-destructive shadow-[0_0_20px_rgba(239,68,68,0.8)] z-30 animate-scan">
                                 <div className="absolute right-0 top-0 bg-destructive text-black text-[10px] font-bold px-1">ANALYZING</div>
                             </div>

                             {/* HUD / Metrics - Right Side */}
                             <div className="absolute top-4 right-4 w-48 space-y-2 z-20">
                                 <div className="bg-black/80 border border-white/10 p-2 rounded text-xs font-mono text-green-400">
                                     <div className="flex justify-between mb-1">
                                         <span className="text-white/50">KEYWORDS</span>
                                         <span>98%</span>
                                     </div>
                                     <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
                                         <div className="w-[98%] h-full bg-green-500" />
                                     </div>
                                 </div>
                                 
                                 <div className="bg-black/80 border border-destructive/30 p-2 rounded text-xs font-mono text-destructive animate-pulse">
                                     <div className="flex justify-between mb-1">
                                         <span className="text-destructive">GAP_DETECTED</span>
                                         <span>CRITICAL</span>
                                     </div>
                                     <div className="text-[10px] text-destructive/80 mt-1">
                                         &gt; Employment gap &gt; 6mo<br/>
                                         &gt; Flagged as high risk
                                     </div>
                                 </div>

                                 <div className="bg-black/80 border border-white/10 p-2 rounded text-xs font-mono text-yellow-400">
                                      <div className="flex justify-between mb-1">
                                         <span className="text-white/50">AGE_EST</span>
                                         <span>45+</span>
                                     </div>
                                     <div className="w-full h-1 bg-white/10 rounded overflow-hidden">
                                         <div className="w-[60%] h-full bg-yellow-400" />
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* Resume Card (Subject) */}
                        <div className="w-[350px] h-[480px] bg-white text-black p-6 rounded shadow-xl flex flex-col gap-4 relative z-0">
                             <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                 <div className="w-16 h-16 bg-gray-200 rounded-full" />
                                 <div>
                                     <div className="h-4 w-32 bg-gray-800 rounded mb-2" />
                                     <div className="h-3 w-48 bg-gray-400 rounded" />
                                 </div>
                             </div>
                             
                             <div className="space-y-3">
                                 <div className="h-3 w-full bg-gray-200 rounded" />
                                 <div className="h-3 w-5/6 bg-gray-200 rounded" />
                                 <div className="h-3 w-4/6 bg-gray-200 rounded" />
                             </div>

                             <div className="p-3 bg-red-50 border border-red-100 rounded mt-2 relative overflow-hidden">
                                 <div className="absolute inset-0 bg-red-500/10 animate-blink" />
                                 <div className="text-xs font-bold text-red-600 mb-1">WORK EXPERIENCE</div>
                                 <div className="h-2 w-full bg-red-200 rounded mb-1" />
                                 <div className="h-2 w-2/3 bg-red-200 rounded" />
                             </div>

                             {/* Big Stamps */}
                             <div className="absolute inset-0 flex items-center justify-center z-40">
                                 <div className="border-8 border-destructive text-destructive font-black text-6xl px-6 py-2 -rotate-12 opacity-0 animate-stamp-impact" style={{ animationDelay: '2s' }}>
                                     REJECTED
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <section ref={containerRef} className="h-[300vh] relative bg-background border-b border-border/5">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="container mx-auto px-6 h-full grid grid-cols-2 items-center gap-12">
                    
                    {/* LEFT: Text Content */}
                    <div className="space-y-12 pl-8 z-20">
                        <div>
                            <h2 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6 relative">
                                THE <br/>
                                <span className="text-destructive relative inline-block">
                                    PROBLEM
                                    {/* Glitch Overlay Effect */}
                                    <span className="absolute inset-0 text-destructive opacity-30 animate-pulse blur-sm" aria-hidden="true">PROBLEM</span>
                                </span>
                            </h2>
                            <p className="text-2xl text-muted-foreground font-light max-w-lg">
                                Why the traditional hiring process is broken and failing you.
                            </p>
                        </div>

                        <div className="space-y-8 relative">
                            {/* Vertical Progress Line */}
                            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border -z-10" />
                            
                             {/* Scroll Progress Indicator for Mobile/Desktop */}
                             <div 
                                className="absolute left-[18px] top-4 w-1 bg-destructive z-0 transition-all duration-300 ease-out"
                                style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
                             />

                            {steps.map((step, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-start gap-6 transition-all duration-500 group ${
                                        activeStep === index ? "opacity-100 scale-100" : "opacity-30 scale-95 blur-[1px]"
                                    }`}
                                >
                                    <div 
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors duration-500 bg-background ${
                                            activeStep === index 
                                                ? "border-destructive text-destructive shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
                                                : "border-muted text-muted-foreground"
                                        }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h3 className={`text-2xl md:text-3xl font-bold mb-2 transition-colors duration-300 ${activeStep === index ? "text-foreground" : "text-muted-foreground"}`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Visuals (Chaos) */}
                    <div className="h-full relative flex items-center justify-center">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                                    activeStep === index 
                                        ? "opacity-100 translate-y-0 scale-100" 
                                        : index < activeStep 
                                            ? "opacity-0 -translate-y-20 scale-95 blur-md" 
                                            : "opacity-0 translate-y-20 scale-105 blur-md" 
                                }`}
                            >
                                {step.visual}
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </section>
    );
}
