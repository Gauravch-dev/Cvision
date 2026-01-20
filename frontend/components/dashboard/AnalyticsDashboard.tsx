"use client";

import { useState } from "react";
import { Users, TrendingUp, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CandidateModal, CandidateProfile } from "./CandidateModal";

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

    // Calculate max values for chart scaling
    const maxDistribution = Math.max(...data.matchDistribution.map(d => d.count));
    const maxActivity = Math.max(...data.activityByDay.map(d => d.count));

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" onClick={onBack} className="text-primary">
                            <ChevronLeft className="size-4 mr-1" />
                            Back
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Total Applicants</p>
                            <h3 className="text-4xl font-bold">{data.totalApplicants}</h3>
                        </div>
                        <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Users className="size-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Avg Match Score</p>
                            <h3 className="text-4xl font-bold">{data.avgMatchScore}%</h3>
                        </div>
                        <div className="size-12 rounded-full bg-green-500/20 flex items-center justify-center">
                            <TrendingUp className="size-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Match Score Distribution */}
                <Card className="p-6">
                    <h3 className="font-semibold mb-4">Match Score Distribution</h3>
                    <div className="space-y-3">
                        {data.matchDistribution.map((item) => {
                            const percentage = (item.count / maxDistribution) * 100;
                            return (
                                <div key={item.range} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{item.range}</span>
                                        <span className="font-medium">{item.count}</span>
                                    </div>
                                    <div className="h-8 bg-muted rounded-lg overflow-hidden">
                                        <div
                                            className="h-full bg-foreground transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Applicant Activity */}
                <Card className="p-6">
                    <h3 className="font-semibold mb-4">Applicant Activity</h3>
                    <div className="flex items-end justify-between gap-2 h-48">
                        {data.activityByDay.map((item) => {
                            const height = (item.count / maxActivity) * 100;
                            return (
                                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="flex-1 w-full flex items-end">
                                        <div
                                            className="w-full bg-primary/80 hover:bg-primary transition-all rounded-t-lg relative group"
                                            style={{ height: `${height}%` }}
                                        >
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium opacity-0 group-hover:opacity-100 transition">
                                                {item.count}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium">{item.day}</span>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            {/* Candidates List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">All Candidates</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">All Candidates</Button>
                        <Button variant="ghost" size="sm">Top Matches ({data.candidates.filter(c => c.score >= 80).length})</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.candidates.map((candidate) => (
                        <Card
                            key={candidate.id}
                            className="p-5 hover:shadow-lg transition-all cursor-pointer group border-border/50"
                            onClick={() => setSelectedCandidate(candidate)}
                        >
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="size-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold border-2 border-primary/10">
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
                                            <h4 className="font-semibold truncate">{candidate.name}</h4>
                                            <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
                                        </div>
                                        <Badge
                                            variant={candidate.score >= 80 ? "default" : "secondary"}
                                            className="ml-2 flex-shrink-0"
                                        >
                                            {candidate.score}% Match
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mt-3">
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

                                    {/* Skill Match Progress Bars */}
                                    <div className="mt-3 space-y-1.5">
                                        {['Skills Match', 'Role Fit'].map((label, idx) => {
                                            const score = idx === 0 ? candidate.radarScores.skills : candidate.radarScores.roleFit;
                                            return (
                                                <div key={label} className="space-y-0.5">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">{label}</span>
                                                        <span className="font-medium">{score}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary transition-all"
                                                            style={{ width: `${score}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full mt-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                    >
                                        View Profile
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Candidate Modal */}
            {selectedCandidate && (
                <CandidateModal
                    candidate={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                />
            )}
        </div>
    );
}
