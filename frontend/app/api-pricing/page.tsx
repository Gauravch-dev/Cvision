
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

export default function ApiPricingPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-8 max-w-7xl mx-auto text-center">
        <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                API Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Integrate CVision's powerful parsing and matching engine directly into your ATS or platform.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-card border border-border flex flex-col text-left">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">Starter</h3>
                    <div className="text-4xl font-black mt-4">$49<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3"><Check className="size-5 text-green-500" /> 1,000 Parses / mo</li>
                    <li className="flex items-center gap-3"><Check className="size-5 text-green-500" /> 95% Uptime SLA</li>
                    <li className="flex items-center gap-3"><Check className="size-5 text-green-500" /> Standard Support</li>
                </ul>
                <Button variant="outline" className="w-full rounded-xl">Get API Key</Button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col text-left relative">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-primary">Scale</h3>
                    <div className="text-4xl font-black mt-4">$199<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3"><Check className="size-5 text-primary" /> 10,000 Parses / mo</li>
                    <li className="flex items-center gap-3"><Check className="size-5 text-primary" /> 99.9% Uptime SLA</li>
                    <li className="flex items-center gap-3"><Check className="size-5 text-primary" /> Dedicated Support</li>
                    <li className="flex items-center gap-3"><Check className="size-5 text-primary" /> Bulk Processing</li>
                </ul>
                <Button className="w-full rounded-xl shadow-lg shadow-primary/20">Get API Key</Button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-card border border-border flex flex-col text-left">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold">Enterprise</h3>
                    <div className="text-4xl font-black mt-4">Custom</div>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3"><Check className="size-5 text-muted-foreground" /> Unlimited Parses</li>
                    <li className="flex items-center gap-3"><Check className="size-5 text-muted-foreground" /> Private Cloud Option</li>
                    <li className="flex items-center gap-3"><Check className="size-5 text-muted-foreground" /> Custom Models</li>
                </ul>
                <Button variant="outline" className="w-full rounded-xl">Contact Sales</Button>
            </div>
        </div>
    </div>
  );
}
