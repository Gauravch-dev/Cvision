"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import {
  BrainCircuit,
  CompassIcon,
  HomeIcon,
  LoaderIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
        <BrainCircuit className="size-4 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold ">
        <span className="text-primary">C</span>Vision
      </span>
    </Link>
  );
};

export default function Header() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isHomePage
          ? "absolute bg-transparent border-b-0"
          : "bg-background/80 backdrop-blur-md border-b border-border"
      )}
    >
      <div className="wrapper px-12">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                isHomePage
                  ? "text-foreground/80 hover:text-foreground hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <HomeIcon className="size-4" />
              <span>Home</span>
            </Link>

            <Link
              href="/explore"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                isHomePage
                  ? "text-foreground/80 hover:text-foreground hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <CompassIcon className="size-4" />
              <span>Explore</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className={cn(isHomePage && "hover:bg-white/10")}
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
              {/* <Button asChild>
                                        <Link href="/">
                                        <SparklesIcon className="size-4"/>will add later</Link>
                                    </Button> */}
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
