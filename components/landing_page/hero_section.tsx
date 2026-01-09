import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

const LiveBadge=()=>{
    return(
        <Badge variant="outline" className="px-4 py-2 mb-8 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute
                    inline-flex h-full w-full
                    rounded-full bg-primary opacity-75"/>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"/>
            </span>
            <span className="text-muted-foreground">Smart Resume Parser & Role Matcher</span>
        </Badge>
    );
}

export default function HeroSection(){
    return(
        <section className="relative overflow-hidden bg-linear-to-b from-background via-background to-muted/20">
        <div className="wrapper">
            <div className="flex flex-col items-center justify-center lg:py-24 py-12 text-center">
                <LiveBadge/>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-5xl">Screen resumes faster, smarter, and with minimal manual effort</h1>

                <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                    Automatically extract resume data and instantly match candidates to job descriptions with an intelligent relevance score
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-16">

  <SignInButton mode="redirect" redirecturl="/upload">
    <Button size="lg" className="text-base px-8 shadow-lg">
      <SparklesIcon className="size-5 mr-2" />
      Upload Resume
    </Button>
  </SignInButton>

  <SignInButton mode="redirect" redirecturl="/match">
    <Button
      size="lg"
      variant="secondary"
      className="text-base px-8 shadow-lg"
    >
      Match with JD
      <ArrowRightIcon className="size-5 ml-2" />
    </Button>
  </SignInButton>

</div>
            </div>
        </div>
    </section>
);
}