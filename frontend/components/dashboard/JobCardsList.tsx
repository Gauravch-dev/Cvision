"use client";

import { Upload, Check, Briefcase, Calendar, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";

export interface JobRequirement {
    _id: string;
    jobTitle: string;
    jobDescription: string;
    skills: string | string[];
    experience: string;
    status?: string;
    resumeCount?: number;
    createdAt: string;
}

interface JobCardsListProps {
    jobs: JobRequirement[];
    onUploadResumes: (job: JobRequirement) => void;
    onViewProfile: (job: JobRequirement) => void;
    onStatusChange: (job: JobRequirement, status: string) => void;
}

export default function JobCardsList({ jobs, onUploadResumes, onViewProfile, onStatusChange }: JobCardsListProps) {
    const getRelativeTime = (date: string) => {
        const now = new Date();
        const created = new Date(date);
        const diffMs = now.getTime() - created.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, index) => {
                const [expanded, setExpanded] = useState(false);
                const [dropdownOpen, setDropdownOpen] = useState(false);
                const skillsArray = Array.isArray(job.skills)
                    ? job.skills
                    : typeof job.skills === 'string'
                        ? job.skills.split(',').map(s => s.trim())
                        : [];
                const visibleSkills = skillsArray.slice(0, 5);
                const remainingSkills = skillsArray.length - 5;

                return (
                    <div
                        key={job._id}
                        className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-card hover:border-border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                    >


                        {/* Header with icon and STATUS DROPDOWN */}
                        <div className="flex items-start justify-between mb-5 relative">
                            <div className="flex items-center gap-3">
                                <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Briefcase className="size-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors duration-300">{job.jobTitle}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="size-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            {getRelativeTime(job.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-background/50 text-xs font-medium hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex size-2">
                                            {job.status === 'online' && (
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            )}
                                            <span className={`relative inline-flex rounded-full size-2 ${job.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'}`}></span>
                                        </span>
                                        <span className={job.status === 'online' ? 'text-green-500' : 'text-muted-foreground'}>
                                            {job.status === 'online' ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                    <ChevronDown className="size-3" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-32 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <button
                                            onClick={() => {
                                                onStatusChange(job, 'online');
                                                setDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-muted ${job.status === 'online' ? 'text-green-500 bg-green-500/5' : ''}`}
                                        >
                                            <div className={`size-2 rounded-full ${job.status === 'online' ? 'bg-green-500' : 'border border-foreground'}`} />
                                            Online
                                        </button>
                                        <button
                                            onClick={() => {
                                                onStatusChange(job, 'offline');
                                                setDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-muted ${job.status === 'offline' ? 'text-muted-foreground bg-muted/50' : ''}`}
                                        >
                                            <div className={`size-2 rounded-full ${job.status === 'offline' ? 'bg-muted-foreground' : 'border border-foreground'}`} />
                                            Offline
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description with smooth expand */}
                        <div className="mb-5">
                            <p className={`text-sm text-muted-foreground leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-2'}`}>
                                {job.jobDescription}
                            </p>
                            {job.jobDescription.length > 150 && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="text-xs text-primary hover:text-primary/80 mt-2 font-medium transition-colors inline-flex items-center gap-1"
                                >
                                    {expanded ? "Show less" : "Read more"}
                                    <span className={`transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>↓</span>
                                </button>
                            )}
                        </div>

                        {/* Skills with staggered animation */}
                        {visibleSkills.length > 0 && (
                            <div className="mb-5">
                                <div className="flex flex-wrap gap-2">
                                    {visibleSkills.map((skill, skillIndex) => (
                                        <span
                                            key={skillIndex}
                                            className="px-3 py-1.5 bg-primary/5 text-primary/90 border border-primary/10 rounded-lg text-xs font-medium hover:bg-primary/10 hover:border-primary/20 transition-all duration-200 hover:scale-105"
                                            style={{ animationDelay: `${(index * 100) + (skillIndex * 50)}ms` }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {remainingSkills > 0 && (
                                        <span className="px-3 py-1.5 bg-muted/50 text-muted-foreground rounded-lg text-xs font-medium">
                                            +{remainingSkills} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Stats with subtle separators */}
                        <div className="flex items-center gap-6 mb-6 pb-5 border-b border-border/50">
                            <div className="flex items-center gap-2">
                                <div className="size-1.5 rounded-full bg-primary/60" />
                                <span className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{job.experience}</span> exp
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-1.5 rounded-full bg-blue-500/60" />
                                <span className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{job.resumeCount || 0}</span> resumes
                                </span>
                            </div>
                        </div>

                        {/* Premium action buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => onUploadResumes(job)}
                                className="flex-1 bg-primary text-primary-foreground px-4 py-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 hover:brightness-110 flex items-center justify-center gap-2 group"
                            >
                                <Upload className="size-4 group-hover:rotate-12 transition-transform duration-300" />
                                <span>Upload Resumes</span>
                            </button>
                            <button
                                onClick={() => onViewProfile(job)}
                                className="flex-1 bg-transparent border border-border/80 text-foreground px-4 py-3.5 rounded-xl font-medium hover:bg-muted/50 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group/view"
                            >
                                <Sparkles className="size-4 group-hover/view:scale-110 transition-transform duration-200 text-yellow-500" />
                                <span>View Profiles</span>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
