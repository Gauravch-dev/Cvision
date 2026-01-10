import Link from "next/link";
import { SparklesIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-24 pb-12 relative overflow-hidden">
        
      {/* Massive CTA Section */}
      <div className="wrapper mb-24 text-center">
        <h2 className="text-massive leading-[0.8] mb-8">
            READY?<br/>
            START NOW
        </h2>
        <p className="text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of recruiters screening smarter, not harder.
        </p>
        <Link href="/sign-up">
            <Button size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all">
                <SparklesIcon className="w-6 h-6 mr-2" />
                Get Started for Free
            </Button>
        </Link>
      </div>

      <div className="wrapper">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 px-4">
            <div className="col-span-2 md:col-span-1">
                <Link href="/" className="text-2xl font-bold tracking-tighter mb-4 block">
                    Cvision.
                </Link>
                <p className="text-muted-foreground">
                    Next-gen resume screening infrastructure for modern hiring teams.
                </p>
            </div>
            
            <div>
                <h4 className="font-semibold mb-6">Product</h4>
                <ul className="space-y-4 text-muted-foreground">
                    <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                    <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                    <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-semibold mb-6">Company</h4>
                <ul className="space-y-4 text-muted-foreground">
                    <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                    <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                    <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                </ul>
            </div>
            
            <div>
                <h4 className="font-semibold mb-6">Legal</h4>
                <ul className="space-y-4 text-muted-foreground">
                    <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                    <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                </ul>
            </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Cvision Inc. All rights reserved.
        </div>
      </div>
      
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
    </footer>
  );
}
