"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Building2, Globe, Cpu, Cloud, Database, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const companies = [
  { name: "TechGiant", icon: Building2 },
  { name: "GlobalSys", icon: Globe },
  { name: "AI Core", icon: Cpu },
  { name: "CloudNet", icon: Cloud },
  { name: "DataFlow", icon: Database },
  { name: "SecureX", icon: Lock },
  { name: "FutureWorks", icon: Sparkles },
  { name: "TechGiant", icon: Building2 },
  { name: "GlobalSys", icon: Globe },
  { name: "AI Core", icon: Cpu },
  { name: "CloudNet", icon: Cloud },
  { name: "DataFlow", icon: Database },
  { name: "SecureX", icon: Lock },
  { name: "FutureWorks", icon: Sparkles },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden">
      
      {/* LEFT SIDE: Cinematic Info & Marquee */}
      <div className="hidden lg:flex flex-col relative w-1/2 p-12 bg-black border-r border-border/20 overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/10 pointer-events-none" />
        
        {/* Floating Shapes */}
        <div className="absolute top-[-20%] left-[-20%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] animate-pulse-3d opacity-30" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[40vw] h-[40vw] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-3d opacity-30" style={{ animationDelay: '2s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Header */}
            <div>
                 <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter">CVision AI</span>
                 </Link>
                 
                 <div className="mt-20">
                     <h1 className="text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
                        {title}
                     </h1>
                     <p className="text-xl text-muted-foreground max-w-md leading-relaxed">
                        {subtitle}
                     </p>
                 </div>
            </div>
            
            {/* Footer / Marquee */}
            <div className="mb-10 space-y-8">
                <p className="text-sm uppercase tracking-widest text-muted-foreground/50 font-bold">Trusted by Industry Leaders</p>
                
                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden mask-fade-sides">
                    {/* Inner Track - Moving */}
                    <div className="flex gap-12 animate-marquee whitespace-nowrap will-change-transform">
                        {companies.map((company, i) => (
                            <div key={i} className="flex items-center gap-3 text-muted-foreground/50 hover:text-primary transition-colors duration-300">
                                <company.icon className="w-8 h-8" />
                                <span className="text-xl font-bold">{company.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative">
          
          {/* Mobile Background Elements */}
          <div className="lg:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden">
             <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[80px]" />
          </div>

          <div className="absolute top-6 right-6 lg:top-12 lg:right-12 z-20">
             <Link href="/">
                <Button variant="ghost" className="gap-2 hover:bg-muted/50 rounded-full pl-2 pr-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Home
                </Button>
             </Link>
          </div>

          <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 slide-in-from-bottom-4">
              {children}
          </div>
          
      </div>

      {/* Styles for marquee and mask */}
      <style jsx global>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
            animation-play-state: paused;
        }
        .mask-fade-sides {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
}
