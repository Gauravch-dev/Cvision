"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    History,
    CreditCard,
    LogOut,
    Files
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

const sidebarItems = [
    {
        title: "Generate Analysis",
        href: "/dashboard",
        icon: LayoutDashboard,
        startsWith: false, // Exact match for root dashboard
    },
    {
        title: "Previous JDs",
        href: "/dashboard/history",
        icon: History,
        startsWith: true,
    },
    {
        title: "API Pricing",
        href: "/dashboard/pricing",
        icon: CreditCard,
        startsWith: true,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-screen w-64 border-r bg-background/50 backdrop-blur-xl border-border fixed left-0 top-0 z-30">
            <div className="p-6 border-b border-border/50 flex-shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Files className="size-5 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">CVision</span>
                </Link>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto min-h-0">
                {sidebarItems.map((item) => {
                    const isActive = item.startsWith
                        ? pathname.startsWith(item.href)
                        : pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("size-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                            {item.title}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border/50 flex-shrink-0 bg-background backdrop-blur-xl">
                <SignOutButton>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="size-4" />
                        Sign Out
                    </Button>
                </SignOutButton>
            </div>
        </div>
    );
}
