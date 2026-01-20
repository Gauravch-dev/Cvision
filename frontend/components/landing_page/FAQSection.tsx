"use client";

import { useRef, useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does the AI matching work?",
    answer: "Our engine uses advanced NLP to understand the semantic meaning behind resume skills and job descriptions, not just keyword matching. It understands that 'React' and 'React.js' are the same, and that 'Frontend Architecture' implies seniority."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade encryption for all data storage and transmission. Your candidate data is processed in isolated containers and never used to train public models without your explicit consent."
  },
  {
    question: "Can I integrate with my ATS?",
    answer: "Yes! We support seamless integration with major ATS providers like Greenhouse, Lever, and Workday via our robust API. You can push parsed profiles directly into your existing workflow."
  },
  {
    question: "What file formats do you support?",
    answer: "We support PDF, DOCX, TXT, and RTF formats. Our OCR capabilities can even extracting text from scanned PDF resumes with high accuracy."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, you can process up to 50 resumes for free to test our accuracy and matching engine. No credit card required to get started."
  }
];

export function FAQSection() {
    return (
        <section className="min-h-screen py-32 bg-background relative z-10">
            <div className="container mx-auto px-6">
                 <div className="mb-24 text-center">
                    <h2 className="text-massive leading-[0.85] mb-6">FAQ</h2>
                    <p className="text-xl text-muted-foreground">Everything you need to know.</p>
                 </div>

                 <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} faq={faq} index={i} />
                    ))}
                 </div>
            </div>
            
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        </section>
    );
}

function FAQItem({ faq, index }: { faq: { question: string, answer: string }, index: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div 
            ref={itemRef}
            className={`
                group rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
                ${isOpen ? 'bg-card/60 scale-[1.02] shadow-2xl border-primary/20 ring-1 ring-primary/10' : 'hover:bg-card/50'}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-lg md:text-xl font-bold tracking-tight text-foreground/90 group-hover:text-primary transition-colors pr-8">
                    {faq.question}
                </span>
                <div className={`
                    w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 transition-all duration-300
                    ${isOpen ? 'bg-primary border-primary text-primary-foreground rotate-180' : 'text-muted-foreground group-hover:border-primary/50'}
                `}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>
            <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-6 pt-0 text-base text-muted-foreground leading-relaxed">
                    {faq.answer}
                </div>
            </div>
        </div>
    );
}
