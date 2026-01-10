"use client";

import { CloudUpload, FileSearch, RefreshCw } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Upload",
      description: "Drag & drop single or bulk resumes. We support PDF, DOCX, and TXT.",
      icon: CloudUpload,
      color: "bg-blue-500/10 text-blue-500",
      rotate: "-1deg"
    },
    {
      id: "02",
      title: "Parse",
      description: "Our AI instantly extracts skills, experience, and education into structured data.",
      icon: FileSearch,
      color: "bg-purple-500/10 text-purple-500",
      rotate: "2deg"
    },
    {
      id: "03",
      title: "Match",
      description: "Get immediate relevance scores against your Job Description.",
      icon: RefreshCw,
      color: "bg-emerald-500/10 text-emerald-500",
      rotate: "-1.5deg"
    },
  ];

  return (
    <section className="bg-background py-32">
      <div className="wrapper">
        <div className="mb-24 text-center">
            <h2 className="text-massive text-7xl md:text-9xl tracking-tighter opacity-10">PROCESS</h2>
            <div className="-mt-12 md:-mt-20 relative z-10">
                <h3 className="text-3xl md:text-5xl font-bold">How Cvision Works</h3>
                <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
                    Three simple steps to transform your hiring workflow.
                </p>
            </div>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div 
                key={step.id} 
                className="sticky top-32 group" 
                style={{ 
                    marginTop: `${index * 2}rem`, 
                    marginBottom: `${(steps.length - index - 1) * 20}vh`,
                    transform: `rotate(${step.rotate})`, 
                }}
            >
              <div 
                className="relative overflow-hidden bg-card border border-border p-8 md:p-12 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 card-3d"
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className={`inline-flex p-4 rounded-2xl mb-6 ${step.color}`}>
                            <step.icon className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                        <h4 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{step.title}</h4>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                    <div className="order-1 md:order-2 flex justify-center md:justify-end">
                        <span className="text-[10rem] md:text-[15rem] leading-none font-black text-muted/20 select-none">
                            {step.id}
                        </span>
                    </div>
                </div>
                
                {/* Decorative background blur */}
                <div className={`absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
