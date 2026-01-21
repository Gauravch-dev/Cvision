"use client";

import { useState } from "react";
import { Users, TrendingUp, ChevronLeft } from "lucide-react";
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

                <Button className="shadow-lg">Export List</Button>
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
                            className="p-5 hover:shadow-lg transition-all cursor-pointer group border-border/50 flex flex-col"
                            onClick={() => setSelectedCandidate(candidate)}
                        >
                            <div className="flex gap-4 mb-4">
                                <div className="flex-shrink-0">
                                    <div className="size-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold border-2 border-primary/10">
                                        {candidate.profilePicture ? (
                                            <img src={candidate.profilePicture} alt={candidate.name} className="size-full rounded-full object-cover" />
                                        ) : (
                                            candidate.name.split(' ').map(n => n[0]).join('')
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <div>
                                            <h4 className="font-semibold truncate text-lg">{candidate.name}</h4>
                                            <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={candidate.score >= 80 ? "default" : "secondary"}
                                        className=""
                                    >
                                        {candidate.score}% Match
                                    </Badge>
                                </div>
                            </div>

                            {/* Skills Tag Line */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {candidate.skills.slice(0, 3).map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-2 py-0.5 rounded text-xs bg-muted font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {candidate.skills.length > 3 && (
                                    <span className="px-2 py-0.5 rounded text-xs bg-muted font-medium text-muted-foreground">
                                        +{candidate.skills.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="mt-auto space-y-3">
                                {/* Skill Match Progress Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Skills Match</span>
                                        <span className="font-medium">{candidate.radarScores?.skills || 0}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${candidate.radarScores?.skills || 0}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Experience Match Progress Bar */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Experience Match</span>
                                        <span className="font-medium">{candidate.radarScores?.experience || 0}%</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all"
                                            style={{ width: `${candidate.radarScores?.experience || 0}%` }}
                                        />
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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
