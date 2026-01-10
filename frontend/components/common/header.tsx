import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { BrainCircuit, CompassIcon, HomeIcon, LoaderIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const Logo=()=>{
    return(
    <Link href="/" className="flex items-center gap-2 group">
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
            <BrainCircuit className="size-4 text-primary-foreground"/>
        </div>
        <span className="text-xl font-bold "><span className="text-primary">C</span>Vision</span></Link>
    );
};

export default function Header() {
    return(
        <div className="wrapper px-12">
            <div className="flex h-16 items-center justify-between">
                <Logo/>
                <nav className="flex items-center gap-1">
                    <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50">
                        <HomeIcon className="size-4"/>
                            <span>Home</span>
                    </Link>

                    <Link href="/explore" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/50">
                        <CompassIcon className="size-4"/>
                            <span>Explore</span>
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                            <SignedOut>
                                <Link href="/sign-in">
                                  <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href="/sign-up">
                                  <Button>Sign Up</Button>
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <UserButton/>
                                {/* <Button asChild>
                                    <Link href="/">
                                    <SparklesIcon className="size-4"/>will add later</Link>
                                </Button> */}
                            </SignedIn>
                    </div>
            </div>
        </div>
    );
}