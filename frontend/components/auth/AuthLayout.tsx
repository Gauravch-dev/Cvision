"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const companies = [
  { name: "Adobe", logo: "/logos/adobe.png" },
  { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Apple", logo: "/logos/apple.png" },
  { name: "Google", logo: "/logos/google.png" },
  { name: "IBM", logo: "/logos/ibm.png" },
  { name: "Intel", logo: "/logos/intel.png" },
  { name: "Meta", logo: "/logos/meta.png" },
  { name: "Microsoft", logo: "/logos/microsoft.jpeg" },
  { name: "Netflix", logo: "/logos/netflix.png" },
  { name: "Nvidia", logo: "/logos/nvidia.png" },
  { name: "Oracle", logo: "/logos/oracle.png" },
  { name: "PayPal", logo: "/logos/paypal.png" },
  { name: "Salesforce", logo: "/logos/salesforce.png" },
  { name: "Spotify", logo: "/logos/spotify.png" },
  { name: "Tesla", logo: "/logos/tesla.png" },
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full flex bg-background text-foreground overflow-hidden">
      
      {/* LEFT SIDE: Cinematic Info & Marquee */}
      <div className="hidden lg:flex flex-col relative w-1/2 p-12 bg-muted/20 border-r border-border overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-primary/10 pointer-events-none" />
        
        {/* Floating Shapes - Colored */}
        <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Header */}
            <div>
                 <Link href="/" className="inline-flex items-center gap-2 group mb-20 pl-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-105 transition-transform">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold tracking-tighter text-foreground">CVision AI</span>
                    <Badge variant="secondary" className="ml-2 bg-muted/50 text-foreground border-border backdrop-blur-md">Enterprose</Badge>
                 </Link>
                 
                 <div className="pl-4">
                     <h1 className="text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1] text-foreground">
                        {title}
                     </h1>
                     <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-light">
                        {subtitle}
                     </p>
                 </div>
            </div>
            
            {/* Footer / Marquee */}
            <div className="space-y-8">
                <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold pl-4">Trusted by Industry Leaders</p>
                
                {/* Marquee Container */}
                <div className="relative w-full overflow-hidden mask-fade-sides py-6 border-y border-border/50 bg-background/50 backdrop-blur-sm">
                    {/* Inner Track - Moving */}
                    <div className="flex gap-16 animate-marquee whitespace-nowrap will-change-transform items-center">
                        {[...companies, ...companies].map((company, i) => (
                            <div key={i} className="flex items-center gap-3 transition-colors duration-300 group/item">
                                <div className="w-16 h-16 relative flex items-center justify-center transition-transform hover:scale-110">
                                   <img src={company.logo} alt={company.name} className="w-full h-full object-contain dark:brightness-0 dark:invert opacity-80 hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
          
          {/* Mobile Background Elements */}
          <div className="lg:hidden absolute inset-0 z-0 pointer-events-none overflow-hidden bg-background">
             <div className="absolute top-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[80px]" />
          </div>

          <div className="absolute top-8 right-8 z-20">
             <Link href="/">
                <Button variant="ghost" className="gap-2 hover:bg-muted rounded-full pl-2 pr-6 h-12 text-base font-medium text-muted-foreground hover:text-foreground">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Home
                </Button>
             </Link>
          </div>

          <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 slide-in-from-bottom-4">
              {children}
              
              <div className="mt-8 text-center">
                 <p className="text-sm text-muted-foreground">
                    By continuing, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
                 </p>
              </div>
          </div>
          
      </div>

      {/* Styles for marquee and mask */}
      <style jsx global>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
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
