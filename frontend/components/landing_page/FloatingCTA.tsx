"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export function FloatingCTA() {
  const [showBanner, setShowBanner] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !showBanner) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-auto max-w-[340px] animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="bg-foreground text-background p-4 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden group">
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <button
          onClick={() => setShowBanner(false)}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="pr-6">
          <p className="text-sm font-medium leading-relaxed mb-3 text-white">
            Try our product for free.
            <span className="text-white/70 font-normal block text-xs mt-0.5">
              No credit card required.
            </span>
          </p>

          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="h-8 px-4 text-xs font-bold rounded-lg hover:bg-white hover:text-black transition-colors shadow-sm"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
