"use client";

import { useState } from "react";
import { Users, TrendingUp, ChevronLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CandidateModal, CandidateProfile } from "./CandidateModal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AnalyticsData {
    jobTitle: string;
    location: string;
    experienceRange: string;
    salaryRange: string;
    postedDaysAgo: number;
    totalApplicants: number;
    avgMatchScore: number;
    matchDistribution: { range: string; count: number }[];
    activityByDay: { day: string; count: number }[];
    candidates: CandidateProfile[];
}

interface AnalyticsDashboardProps {
    data: AnalyticsData;
    onBack: () => void;
}

export function AnalyticsDashboard({ data, onBack }: AnalyticsDashboardProps) {
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState<"experience" | null>(null);
    const itemsPerPage = 9;

    // Filter and Sort Candidates
    const filteredAndSortedCandidates = [...data.candidates].sort((a, b) => {
        if (sortBy === "experience") {
            return b.experience - a.experience; // Descending order
        }
        return 0;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredAndSortedCandidates.length / itemsPerPage);
    const currentCandidates = filteredAndSortedCandidates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Calculate max values for chart scaling
    const maxDistribution = Math.max(...data.matchDistribution.map(d => d.count));
    const maxActivity = Math.max(...data.activityByDay.map(d => d.count));

    const handleSort = (value: string) => {
        if (value === "experience") {
            setSortBy("experience");
        } else {
            setSortBy(null);
        }
    };

    const handleExportCSV = () => {
        // Define CSV Headers
        const headers = ["Name", "Title", "Match Score", "Email", "Phone", "Experience (Years)", "Location", "Skills"];

        // Map candidate data to rows
        const rows = data.candidates.map(c => [
            `"${c.name}"`,
            `"${c.title}"`,
            `${c.score}`,
            `"${c.contact.email}"`,
            `"${c.contact.phone}"`,
            `${c.experience}`,
            `"${c.location}"`,
            `"${c.skills.join(", ")}"` // Join skills with comma
        ]);

        // Combine headers and rows
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

        // Create Blob and Download Link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `candidates_${data.jobTitle.replace(/\s+/g, "_")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" onClick={onBack} className="text-primary hover:text-primary/80 transition-colors">
                            <ChevronLeft className="size-4 mr-1" />
                            Back to Generate Analysis
                        </Button>
                        <Badge variant="secondary" className="text-xs">
                            Posted {data.postedDaysAgo} days ago
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{data.jobTitle}</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>📍 {data.location}</span>
                        <span>💼 {data.experienceRange}</span>
                        <span>💰 {data.salaryRange}</span>
                    </div>
                </div>

                <Button className="shadow-lg" onClick={handleExportCSV}>
                    <TrendingUp className="size-4 mr-2" />
                    Export List
                </Button>
            </div>

            {/* Candidates List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">All Candidates</h3>
                    <div className="w-[200px]">
                        <Select onValueChange={handleSort} defaultValue={sortBy || "none"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Default</SelectItem>
                                <SelectItem value="experience">Experience (High to Low)</SelectItem>
                                <SelectItem value="location" disabled>Location (Coming Soon)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Grid: 3 columns on large screens (3x3 items) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentCandidates.map((candidate) => (
                        <Card
                            key={candidate.id}
                            className="relative p-5 hover:shadow-xl transition-all duration-300 cursor-pointer group border-border/50 flex flex-col overflow-hidden hover:border-primary/30 bg-card/50 backdrop-blur-sm"
                            onClick={() => setSelectedCandidate(candidate)}
                        >
                            {/* Arc Score - Top Right */}
                            <div className="absolute top-4 right-4 flex flex-col items-center justify-center">
                                <div className="relative size-12">
                                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                        {/* Background Circle */}
                                        <path
                                            className="text-muted/20"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        {/* Progress Circle */}
                                        <path
                                            className={`${candidate.score >= 80 ? "text-green-500" : candidate.score >= 50 ? "text-yellow-500" : "text-red-500"} transition-all duration-1000 ease-out`}
                                            strokeDasharray={`${candidate.score}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-[10px] font-bold">{candidate.score}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-4 pr-12"> {/* Added padding-right to avoid overlap with score */}
                                <div className="flex-shrink-0">
                                    <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-lg font-bold border border-primary/10 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                        {candidate.profilePicture ? (
                                            <img src={candidate.profilePicture} alt={candidate.name} className="size-full rounded-2xl object-cover" />
                                        ) : (
                                            <span className="text-primary">{candidate.name.split(' ').map(n => n[0]).join('')}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="mb-1">
                                        <h4 className="font-bold truncate text-lg group-hover:text-primary transition-colors">{candidate.name}</h4>
                                        <p className="text-xs text-muted-foreground truncate font-medium">{candidate.title}</p>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                                        <MapPin className="size-3" />
                                        <span className="truncate max-w-[100px]">{candidate.location || "Unknown"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Tag Line */}
                            <div className="flex flex-wrap gap-1.5 mb-5">
                                {candidate.skills.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-2 py-1 rounded-md text-[10px] bg-primary/5 border border-primary/10 font-medium text-primary/80"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {candidate.skills.length > 3 && (
                                    <span className="px-2 py-1 rounded-md text-[10px] bg-muted border border-border font-medium text-muted-foreground">
                                        +{candidate.skills.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="mt-auto space-y-4">
                                {/* Skill Match Progress Bar */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground font-medium">Skills Match</span>
                                        <span className="font-bold text-foreground">{candidate.radarScores?.skills || 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-1000"
                                            style={{ width: `${candidate.radarScores?.skills || 0}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Experience Match Progress Bar */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground font-medium">Experience Match</span>
                                        <span className="font-bold text-foreground">{candidate.radarScores?.experience || 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                                            style={{ width: `${candidate.radarScores?.experience || 0}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Education Match Progress Bar */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground font-medium">Education Match</span>
                                        <span className="font-bold text-foreground">{candidate.radarScores?.education || 0}%</span>
                                    </div>
                                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-1000"
                                            style={{ width: `${candidate.radarScores?.education || 0}%` }}
                                        />
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-2 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                                >
                                    View Profile
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* Candidate Modal */}
            {
                selectedCandidate && (
                    <CandidateModal
                        candidate={selectedCandidate}
                        onClose={() => setSelectedCandidate(null)}
                    />
                )
            }
        </div >
    );
}
