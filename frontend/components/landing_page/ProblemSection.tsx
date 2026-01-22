"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, FileWarning, Ban, CalendarClock, SearchX } from "lucide-react";

/* ---------- TYPES ---------- */
type Paper = {
  left: string;
  top: string;
  rotate: string;
  delay: string;
};

type Shred = {
  delay: string;
  width: string;
};

type Spark = {
  tx: string;
  ty: string;
  delay: string;
};

type Keyword = {
  text: string;
  top: string;
  left: string;
  delay: string;
  color: string;
};

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const [papers, setPapers] = useState<Paper[]>([]);
  const [shreds, setShreds] = useState<Shred[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  /* ---------- SCROLL LOGIC ---------- */
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const offset = -rect.top;
      const stepHeight = windowHeight;
      // 5 Steps total (0-4)
      const newStep = Math.floor((offset + windowHeight * 0.3) / stepHeight);

      setActiveStep(Math.max(0, Math.min(4, newStep)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------- RANDOM DATA GENERATION ---------- */
  useEffect(() => {
    // Step 0: Initial Papers
    setPapers(
      Array.from({ length: 6 }).map((_, i) => ({
        left: `${50 + (Math.random() * 40 - 20)}%`,
        top: `${50 + (Math.random() * 40 - 20)}%`,
        rotate: `rotate(${Math.random() * 30 - 15}deg)`,
        delay: `${i * 0.5}s`,
      }))
    );

    // Step 1: Shreds
    setShreds(
      Array.from({ length: 8 }).map(() => ({
        delay: `${0.2 + Math.random() * 0.1}s`,
        width: `${4 + Math.random() * 6}px`,
      }))
    );

    setSparks(
      Array.from({ length: 6 }).map(() => ({
        tx: `${(Math.random() - 0.5) * 100}px`,
        ty: `${(Math.random() + 0.5) * 100}px`,
        delay: `${Math.random()}s`,
      }))
    );

    // Step 4: Keywords
    const buzzwords = ["Synergy", "Cloud Native", "AI-Driven", "Web3", "Blockchain", "Viral", "Growth Hack", "Ninja"];
    setKeywords(
        Array.from({ length: 12 }).map((_, i) => ({
            text: buzzwords[i % buzzwords.length],
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            delay: `${Math.random() * 2}s`,
            color: Math.random() > 0.5 ? "text-primary" : "text-destructive"
        }))
    );
  }, []);

  /* ---------- PREVENT HYDRATION MISMATCH ---------- */
  if (!papers.length || !shreds.length || !sparks.length || !keywords.length) return null;

  const steps = [
    {
      id: 0,
      title: "Manual Screening Chaos",
      desc: "Recruiters spend 100+ hours manually reviewing resumes, leading to burn out and missed deadlines.",
      icon: <Clock className="w-8 h-8" />,
      visual: (
        <div className="relative w-full h-full flex items-center justify-center">
          {papers.map((paper, i) => (
            <div
              key={i}
              className="absolute bg-card border border-border p-4 rounded-lg shadow-xl w-48 h-64 flex flex-col gap-2 animate-float-chaos"
              style={{
                animationDelay: paper.delay,
                left: paper.left,
                top: paper.top,
                transform: `translate(-50%, -50%) ${paper.rotate}`,
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
      ),
    },
    {
      id: 1,
      title: "The Shredder",
      desc: "75% of qualified resumes are rejected by rigid ATS filters that don't understand skills or context.",
      icon: <FileWarning className="w-8 h-8" />,
      visual: (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute bottom-[80px] w-full flex justify-center gap-1 z-0">
            {shreds.map((shred, i) => (
              <div
                key={i}
                className="w-4 h-32 bg-white/50 animate-shred-fall"
                style={{
                  animation: "shred-feed 2s infinite linear",
                  animationDelay: shred.delay,
                  width: shred.width,
                  opacity: 0.5,
                  transformOrigin: "top",
                  clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
                }}
              />
            ))}
          </div>

          {sparks.map((spark, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-destructive rounded-full z-20"
              style={{
                top: "50%",
                left: "50%",
                "--tx": spark.tx,
                "--ty": spark.ty,
                animation: "spark-fly 0.5s infinite linear",
                animationDelay: spark.delay,
              } as React.CSSProperties}
            />
          ))}
          
           {/* Machine Visual Placeholder (Iconic Representation) */}
           <div className="absolute w-40 h-40 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-center shadow-2xl z-10">
                <span className="text-destructive font-mono font-bold animate-pulse">REJECTED</span>
           </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Bias & Inconsistency",
      desc: "Human fatigue and unconscious bias result in inconsistent evaluations and poor hiring decisions.",
      icon: <Ban className="w-8 h-8" />,
      visual: (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-[350px] h-[480px] bg-white text-black p-6 rounded shadow-xl flex flex-col gap-4 overflow-hidden border border-gray-200">
                {/* Resume Content */}
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
                </div>
                
                {/* Scanner Line */}
                <div className="absolute inset-x-0 h-1 bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-scan-line z-20 top-0" />
                
                {/* Stamp */}
                <div className="absolute inset-0 flex items-center justify-center z-30">
                    <div className="border-8 border-destructive text-destructive font-black text-6xl px-4 py-2 -rotate-12 opacity-0 animate-stamp-impact">
                        BIASED
                    </div>
                </div>
            </div>
        </div>
      ),
    },
    {
        id: 3,
        title: "Slow Feedback Loops",
        desc: "Candidates wait weeks for a response, often moving on to other offers before you even decide.",
        icon: <CalendarClock className="w-8 h-8" />,
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-64 h-64 bg-card border-4 border-muted rounded-full flex items-center justify-center relative shadow-2xl">
                    {/* Clock Hands */}
                    <div className="absolute bg-foreground w-1 h-24 bottom-1/2 left-1/2 origin-bottom animate-spin-fast rounded-full" style={{ animationDuration: '4s' }} />
                    <div className="absolute bg-destructive w-1 h-32 bottom-1/2 left-1/2 origin-bottom animate-spin-fast rounded-full" style={{ animationDuration: '1s' }} />
                    <div className="w-4 h-4 bg-foreground rounded-full z-10" />
                    
                    {/* Flying Calendars */}
                    {[...Array(4)].map((_, i) => (
                        <div 
                            key={i} 
                            className="absolute top-0 right-0 w-12 h-16 bg-white text-black p-1 rounded shadow-lg text-[8px] font-mono flex flex-col items-center animate-fly-off"
                            style={{ animationDelay: `${i * 0.8}s` }}
                        >
                            <div className="bg-red-500 w-full h-2 mb-1" />
                            <span>{12 + i}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    },
    {
        id: 4,
        title: "Keyword Spamming",
        desc: "Candidates trick legacy systems by stuffing white-text keywords, rendering your search useless.",
        icon: <SearchX className="w-8 h-8" />,
        visual: (
            <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-[400px] h-[500px] bg-card border border-border p-8 rounded-xl shadow-2xl flex flex-col gap-4 overflow-hidden">
                    <div className="h-6 w-1/2 bg-muted rounded mb-8" />
                    <div className="space-y-4">
                        <div className="h-3 w-full bg-muted/50 rounded" />
                        <div className="h-3 w-5/6 bg-muted/50 rounded" />
                        <div className="h-3 w-full bg-muted/50 rounded" />
                        <div className="h-3 w-4/5 bg-muted/50 rounded" />
                    </div>

                    {/* Hidden/Popping Keywords */}
                    {keywords.map((kw, i) => (
                        <div
                            key={i}
                            className={`absolute font-mono font-bold text-sm ${kw.color} animate-pop-in-out`}
                            style={{
                                top: kw.top,
                                left: kw.left,
                                animationDelay: kw.delay,
                            }}
                        >
                            {kw.text}
                        </div>
                    ))}
                    
                    <div className="absolute inset-0 bg-destructive/5 pointer-events-none border-2 border-destructive/20 rounded-xl" />
                    <div className="absolute bottom-4 right-4 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded animate-pulse">
                        MANIPULATION DETECTED
                    </div>
                </div>
            </div>
        )
    }
  ];

  return (
    <section ref={containerRef} className="h-[500vh] relative bg-background border-b border-border/5">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-6 h-full grid grid-cols-2 items-center gap-12">
          
          {/* LEFT: Text Content */}
          <div className="space-y-12 pl-8 z-20">
            <div>
              <h2 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6 relative">
                THE <br />
                <span className="text-destructive">PROBLEM</span>
              </h2>
              <p className="text-2xl text-muted-foreground font-light max-w-lg">
                  Why the traditional hiring process is broken and failing you.
              </p>
            </div>

            <div className="space-y-8 relative">
                 {/* Progress Bar */}
                 <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border -z-10" />
                 <div 
                    className="absolute left-[18px] top-4 w-1 bg-destructive z-0 transition-all duration-300 ease-out"
                    style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
                 />

                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className={`flex items-start gap-6 transition-all duration-500 group ${
                            activeStep === index ? "opacity-100 scale-100" : "opacity-40 scale-95"
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
                        <div className="flex flex-col">
                            <h3 className={`text-2xl font-bold transition-colors duration-300 ${activeStep === index ? "text-foreground" : "text-muted-foreground"}`}>
                                {step.title}
                            </h3>
                            <div 
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                    activeStep === index ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                                }`}
                            >
                                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
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

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes shred-feed {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes spark-fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes scan-line {
            0% { top: 0%; opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        @keyframes stamp-impact {
            0% { opacity: 0; transform: scale(2) rotate(-12deg); }
            50% { opacity: 1; transform: scale(1) rotate(-12deg); }
            100% { opacity: 1; transform: scale(1) rotate(-12deg); }
        }
        @keyframes spin-fast {
            from { transform: translateX(-50%) rotate(0deg); }
            to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes fly-off {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(100px, -100px) scale(0.5) rotate(20deg); opacity: 0; }
        }
        @keyframes pop-in-out {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        .animate-shred-fall {
            animation: shred-feed 2s infinite linear;
        }
        .animate-scan-line {
            animation: scan-line 2.5s linear infinite;
        }
        .animate-stamp-impact {
            animation: stamp-impact 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            animation-delay: 1.5s;
        }
        .animate-spin-fast {
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }
        .animate-fly-off {
            animation: fly-off 2s ease-in-out infinite;
        }
        .animate-pop-in-out {
            animation: pop-in-out 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
