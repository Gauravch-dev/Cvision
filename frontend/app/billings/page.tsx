
"use client";

import { Button } from "@/components/ui/button";
import { Check, CreditCard, Receipt, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Perfect for testing the waters.",
    features: [
      "100 Resume Parses / month",
      "Basic Keyword Matching",
      "Community Support",
      "Standard Processing Speed"
    ],
    cta: "Current Plan",
    popular: false
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "For growing teams and startups.",
    features: [
      "Unlimited Resume Parses",
      "Semantic & Contextual Matching",
      "Email Support",
      "Advanced Filters",
      "2x Processing Speed"
    ],
    cta: "Upgrade to Pro",
    popular: false
  },
  {
    name: "Pro Plus",
    price: "$99",
    period: "/mo",
    description: "For power users and developers.",
    features: [
      "Everything in Pro",
      "Full API Access (Paid)",
      "Dedicated Account Manager",
      "Custom Integration Support",
      "Priority 24/7 Support",
      "Highest Processing Tier"
    ],
    cta: "Upgrade to Plus",
    popular: true
  }
];

export default function BillingsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-black tracking-tighter mb-6">Choose Your <span className="text-primary">Power</span></h1>
            <p className="text-xl text-muted-foreground">Unlock the full potential of CVision with our flexible plans.</p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {pricingPlans.map((plan, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "relative p-8 rounded-2xl border transition-all duration-300 flex flex-col",
                        plan.popular 
                            ? "bg-card border-primary shadow-[0_0_30px_rgba(var(--primary),0.2)] scale-105 z-10" 
                            : "bg-card/50 border-border hover:border-primary/50"
                    )}
                >
                    {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-current" /> Most Popular
                        </div>
                    )}

                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-4xl font-black">{plan.price}</span>
                            <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <div className="mb-8 flex-1 space-y-4">
                        {plan.features.map((feature, j) => (
                           <div key={j} className="flex items-start gap-3">
                               <div className={cn(
                                   "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                   plan.popular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                               )}>
                                   <Check className="w-3 h-3" />
                               </div>
                               <span className="text-sm">{feature}</span>
                           </div>
                        ))}
                    </div>

                    <Button 
                        className={cn(
                            "w-full rounded-full font-bold", 
                            plan.popular ? "shadow-lg" : ""
                        )}
                        variant={plan.popular ? "default" : "outline"}
                    >
                        {plan.cta}
                    </Button>
                </div>
            ))}
        </div>
        
        {/* Invoice Section */}
         <div className="max-w-4xl mx-auto">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Receipt className="w-5 h-5 text-muted-foreground" /> Invoice History
             </h3>
             <div className="rounded-xl border border-border bg-card divide-y divide-border">
                 <div className="p-8 text-center text-muted-foreground">
                    <p>No invoices found on this account.</p>
                 </div>
             </div>
         </div>
    </div>
  );
}
