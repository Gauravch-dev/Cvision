"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import {
  CompassIcon,
  HomeIcon,
  LoaderIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "../ui/theme-toggle";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="CVision Home">
      <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="none"
          className="size-5 text-primary-foreground"
          aria-hidden="true"
        >
          <path
            d="M360 416H152C99.2 416 56 372.8 56 320V192C56 139.2 99.2 96 152 96H360C386.4 96 408 117.6 408 144C408 170.4 386.4 192 360 192H344V320H360C386.4 320 408 341.6 408 368C408 394.4 386.4 416 360 416Z"
            stroke="currentColor"
            strokeWidth="48"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="152" cy="192" r="24" fill="currentColor" />
          <circle cx="152" cy="320" r="24" fill="currentColor" />
          <circle cx="360" cy="144" r="24" fill="currentColor" />
          <circle cx="360" cy="368" r="24" fill="currentColor" />
          <path
            d="M152 192V320"
            stroke="currentColor"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M248 192V320"
            stroke="currentColor"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <circle cx="248" cy="256" r="32" fill="currentColor" />
          <path
            d="M200 256H152"
            stroke="currentColor"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M344 256H296"
            stroke="currentColor"
            strokeWidth="24"
            strokeLinecap="round"
          />
        </svg>
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

  if (pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up")) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-300",
        isHomePage
          ? "absolute bg-transparent border-b-0"
          : "bg-background/80 backdrop-blur-md border-b border-border",
      )}
    >
      <div className="wrapper px-12">
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/"
              className={cn(
                "group relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                isHomePage
                  ? "text-foreground/80 hover:text-foreground hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              aria-label="Go to home page"
            >
              <HomeIcon className="size-4" aria-hidden="true" />
              <span>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out group-hover:w-full z-10" />
            </Link>



            <Link
              href="/about"
              className={cn(
                "group relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                isHomePage
                  ? "text-foreground/80 hover:text-foreground hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              aria-label="Go to about us page"
            >
              <span>About Us</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out group-hover:w-full z-10" />
            </Link>

            <Link
              href="/api-pricing"
              className={cn(
                "group relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
                isHomePage
                  ? "text-foreground/80 hover:text-foreground hover:bg-white/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              aria-label="View API pricing"
            >
              <span>API Pricing</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out group-hover:w-full z-10" />
            </Link>


          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignedOut>
              <Button
                asChild
                variant="ghost"
                className={cn(isHomePage && "hover:bg-white/10")}
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
