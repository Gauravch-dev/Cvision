"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, ChevronRight, BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Type definition for DB Integration
interface JobHistoryItem {
    id: string;
    title: string;
    createdAt: string;
    candidates: number;
    topCandidate?: string;
    status: "completed" | "processing" | "failed";
}

export default function HistoryPage() {
    const [history, setHistory] = useState<JobHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Future DB Integration: Replace this useEffect with an API call
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // MOCK DATA - REPLACE WITH API CALL
                const mockData: JobHistoryItem[] = [
                    {
                        id: "1",
                        title: "Senior React Engineer",
                        createdAt: "2024-03-10",
                        candidates: 12,
                        topCandidate: "Alex Johnson",
                        status: "completed"
                    },
                    {
                        id: "2",
                        title: "Product Designer",
                        createdAt: "2024-03-08",
                        candidates: 45,
                        topCandidate: "Sarah Chen",
                        status: "completed"
                    },
                    {
                        id: "3",
                        title: "Backend Developer (Go)",
                        createdAt: "2024-03-05",
                        candidates: 8,
                        status: "processing"
                    }
                ];

                setHistory(mockData);
            } catch (error) {
                toast.error("Failed to load history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Previous Job Requirements</h1>
                <p className="text-muted-foreground">View your history of job postings and candidate rankings.</p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 rounded-xl border bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map((item) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Briefcase className="size-5 text-primary" />
                                            {item.title}
                                        </CardTitle>
                                        <CardDescription>Created on {new Date(item.createdAt).toLocaleDateString()}</CardDescription>
                                    </div>
                                    <Badge variant={item.status === "completed" ? "default" : "secondary"}>
                                        {item.status === "completed" ? "Analysis Complete" : "Processing"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-4" />
                                            <span>{item.candidates} Candidates</span>
                                        </div>
                                        {item.status === "completed" && item.topCandidate && (
                                            <div className="flex items-center gap-2 text-foreground font-medium">
                                                <BarChart className="size-4 text-green-500" />
                                                <span>Top Match: {item.topCandidate}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                                        View Details <ChevronRight className="ml-2 size-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
