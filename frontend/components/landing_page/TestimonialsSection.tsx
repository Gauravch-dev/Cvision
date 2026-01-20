"use client";

import { Star, User, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Talent at TechFlow",
    content: "CVision reduced our time-to-hire by 60%. The semantic matching is eerily accurate.",
    rating: 5,
  },
  {
    name: "Michael Ross",
    role: "Recruiting Manager at CloudScale",
    content: "Finally, an AI tool that actually understands context. No more keyword stuffing candidates!",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "VP of HR at FutureCorp",
    content: "The parsing speed is incredible. We processed 10k resumes in an afternoon.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Technical Recruiter at DevStart",
    content: "The API integration was seamless. It's now the brain behind our internal ATS.",
    rating: 5,
  },
  {
    name: "Amanda Low",
    role: "Founder at HireFast",
    content: "Game changer for high-volume hiring. The bias-reduction features are top notch.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Director of Talent at InnovateX",
    content: "The best investment we've made this year. The candidate quality has improved drastically.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-32 bg-background border-t border-border/40 overflow-hidden relative">
      <div className="wrapper text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            Trusted by the <span className="text-primary">Best</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join forward-thinking companies hiring with precision.
        </p>
      </div>

      <div className="wrapper relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {testimonials.map((t, i) => (
            <div 
                key={i} 
                className="p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/40 hover:bg-card/80 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group flex flex-col gap-6"
            >
                <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                </div>
                
                <p className="text-lg text-foreground/90 leading-relaxed italic relative">
                     <Quote className="absolute -top-4 -left-4 w-8 h-8 text-primary/10 rotate-180" />
                    "{t.content}"
                </p>
                
                <div className="mt-auto flex items-center gap-4 pt-4 border-t border-border/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {t.name[0]}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-foreground">{t.name}</h4>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 blur-[100px] pointer-events-none" />
    </section>
  );
}
