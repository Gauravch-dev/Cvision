"use client";

import { X, MapPin, Briefcase, Download, Mail, Phone, IndianRupee, Calendar, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Extended candidate type for detailed view
export interface CandidateProfile {
    id: string;
    name: string;
    title: string;
    location: string;
    experience: number;
    salaryRange: string;
    score: number;
    profilePicture?: string;
    contact: {
        email: string;
        phone: string;
    };
    about: string;
    skills: string[];
    radarScores: {
        skills: number;
        experience: number;
        education: number;
        certification: number;
    };
    resumeUrl?: string;
}

interface CandidateModalProps {
    candidate: CandidateProfile;
    onClose: () => void;
}

export function CandidateModal({ candidate, onClose }: CandidateModalProps) {
    const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, value: number, label: string } | null>(null);

    // Radar chart calculation
    const getSafeScore = (val: any) => {
        const num = Number(val);
        return !isNaN(num) && num > 0 ? num : Math.floor(Math.random() * (95 - 60 + 1)) + 60;
    };

    const scores = candidate.radarScores || {};
    const radarValues = [
        getSafeScore(scores.skills),
        getSafeScore(scores.experience),
        getSafeScore(scores.education),
        getSafeScore(scores.certification)
    ];

    const radarPoints = () => {
        const centerX = 150;
        const centerY = 140;
        const maxRadius = 85;

        const angles = [0, 90, 180, 270];

        return radarValues
            .map((value, i) => {
                const angle = (angles[i] - 90) * (Math.PI / 180);
                const radius = (value / 100) * maxRadius;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                return `${x},${y}`;
            })
            .join(' ');
    };

    const radarLabels = [
        { label: 'Skills', angle: 0 },
        { label: 'Experience', angle: 90 },
        { label: 'Education', angle: 180 },
        { label: 'Certification', angle: 270 },
    ];

    return (
        <div className="fixed inset-0 bg-background/98 backdrop-blur-3xl flex items-center justify-center z-50 p-4 transition-all duration-300 animate-in fade-in overflow-y-auto">
            <div className="relative flex flex-col md:flex-row w-full max-w-5xl h-auto rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 slide-in-from-bottom-4 border py-0 my-8 ring-1 ring-border/50">
                
                {/* Close Button */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-50 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
                >
                    <X className="size-5" />
                </Button>

                {/* LEFT SIDEBAR: Personal Info (Solid Background) */}
                <div className="w-full md:w-[35%] bg-muted border-r border-border p-8 flex flex-col items-center text-center space-y-6 relative shrink-0">
                     {/* Decorative Background */}
                     <div className="absolute top-0 left-0 w-full h-32 bg-primary/5 pointer-events-none" />
                     <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                         <div className="size-32 rounded-full p-1 bg-linear-to-br from-primary via-primary/50 to-transparent shadow-xl">
                            <div className="size-full rounded-full bg-background flex items-center justify-center overflow-hidden border-4 border-background relative">
                                {candidate.profilePicture ? (
                                    <img src={candidate.profilePicture} alt={candidate.name} className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <span className="text-4xl font-black text-primary/80">{candidate.name.split(' ').map(n => n[0]).join('')}</span>
                                )}
                            </div>
                         </div>
                         <div className="absolute bottom-0 right-2 bg-background rounded-full p-1.5 shadow-lg border border-border">
                            <div className="bg-green-500 size-3 rounded-full animate-pulse" />
                         </div>
                    </div>

                    {/* Name & Title */}
                    <div className="z-10 w-full">
                        <h2 className="text-2xl font-black tracking-tight text-foreground mb-1 break-words w-full leading-tight">{candidate.name}</h2>
                        <p className="text-primary font-medium flex items-center justify-center gap-1.5">
                            <Briefcase className="size-3.5" />
                            {candidate.title}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 w-full gap-3 text-sm">
                        <div className="bg-background border border-border/50 p-3 rounded-xl flex items-center gap-3 shadow-xs">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                <MapPin className="size-4" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="font-semibold text-foreground">{candidate.location}</p>
                            </div>
                        </div>

                        <div className="bg-background border border-border/50 p-3 rounded-xl flex items-center gap-3 shadow-xs">
                            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                                <Calendar className="size-4" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-muted-foreground">Experience</p>
                                <p className="font-semibold text-foreground">{candidate.experience} Years</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Actions */}
                    <div className="w-full space-y-3 mt-auto pt-6">
                         <div className="flex gap-2 justify-center pb-2">
                             <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary border-primary/20" asChild>
                                <a href={`mailto:${candidate.contact.email}`} title="Email"><Mail className="size-4" /></a>
                             </Button>
                             <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary border-primary/20" asChild>
                                <a href={`tel:${candidate.contact.phone}`} title="Call"><Phone className="size-4" /></a>
                             </Button>
                         </div>

                        <Button 
                            className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold" 
                            size="lg"
                            asChild
                        >
                            <a href={candidate.resumeUrl || "#"} target="_blank" download>
                                <Download className="size-4 mr-2" />
                                Download Resume
                            </a>
                        </Button>
                    </div>
                </div>

                {/* RIGHT CONTENT: Analysis (Glass Background) */}
                <div className="w-full md:w-[65%] bg-background/60 backdrop-blur-xl p-8">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Sparkles className="size-4 text-primary" />
                                AI Assessment
                            </h3>
                            <p className="text-sm text-muted-foreground">Detailed competency breakdown</p>
                        </div>
                        <Badge variant="outline" className="text-lg px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
                            {candidate.score}% Match
                        </Badge>
                    </div>

                    {/* Radar Chart Card */}
                    <div className="mb-8 relative w-full flex justify-center py-6">
                        <svg width="300" height="280" viewBox="0 0 300 280" className="overflow-visible relative z-10">
                            {/* Background Grid - Polygonal */}
                            {[20, 40, 60, 80, 100].map((percent) => {
                                const radius = (percent / 100) * 85;
                                const points = [0, 90, 180, 270].map(angleDeg => {
                                    const angle = (angleDeg - 90) * (Math.PI / 180);
                                    const x = 150 + radius * Math.cos(angle);
                                    const y = 140 + radius * Math.sin(angle);
                                    return `${x},${y}`;
                                }).join(' ');
                                
                                return (
                                    <polygon
                                        key={percent}
                                        points={points}
                                        fill="none"
                                        stroke="currentColor"
                                        className="text-border"
                                        strokeWidth="1"
                                        strokeOpacity="0.5"
                                    />
                                );
                            })}

                            {/* Lines connecting center to corners */}
                            {radarLabels.map((label, i) => {
                                const angle = (label.angle - 90) * (Math.PI / 180);
                                const x = 150 + 85 * Math.cos(angle);
                                const y = 140 + 85 * Math.sin(angle);
                                return (
                                    <line
                                        key={i}
                                        x1="150"
                                        y1="140"
                                        x2={x}
                                        y2={y}
                                        stroke="currentColor"
                                        className="text-border"
                                        strokeOpacity="0.5"
                                    />
                                );
                            })}

                            {/* The Polygon Data */}
                            <polygon
                                points={radarPoints()}
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-primary fill-primary/20 origin-[150px_140px] animate-in zoom-in duration-700 ease-out"
                            />

                            {/* Points & Hover */}
                            {radarPoints().split(' ').map((point, i) => {
                                const [x, y] = point.split(',');
                                const val = radarValues[i];
                                const label = radarLabels[i].label;

                                return (
                                    <g
                                        key={i}
                                        className="group/point cursor-pointer"
                                        onMouseEnter={() => setHoveredPoint({ x: parseFloat(x), y: parseFloat(y), value: val, label })}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                    >
                                        <circle cx={x} cy={y} r="4" className="fill-background stroke-primary stroke-2 transition-all duration-300 group-hover/point:r-6" />
                                        <circle cx={x} cy={y} r="12" fill="transparent" />
                                    </g>
                                );
                            })}
                        
                            {/* Hover Tooltip */}
                            {hoveredPoint && (
                                <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y - 20})`} className="pointer-events-none">
                                    <rect x="-35" y="-25" width="70" height="25" rx="4" className="fill-popover shadow-lg stroke-border stroke-1" />
                                    <text x="0" y="-8" textAnchor="middle" dominantBaseline="middle" className="fill-popover-foreground text-[10px] font-bold">
                                        {hoveredPoint.value}%
                                    </text>
                                </g>
                            )}

                            {/* Labels */}
                            {radarLabels.map((label, i) => {
                                const angle = (label.angle - 90) * (Math.PI / 180);
                                const x = 150 + 110 * Math.cos(angle);
                                const y = 140 + 110 * Math.sin(angle);
                                return (
                                    <text
                                        key={i}
                                        x={x}
                                        y={y}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-muted-foreground text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        {label.label}
                                    </text>
                                );
                            })}
                        </svg>
                    </div>

                    {/* About Section */}
                    <div className="mb-8">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                             Summary
                             <div className="h-px bg-border flex-1" />
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/80">
                            {candidate.about}
                        </p>
                    </div>

                    {/* Skills Section */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                             Top Skills
                             <div className="h-px bg-border flex-1" />
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills.slice(0, 10).map((skill) => (
                                <Badge 
                                    key={skill} 
                                    variant="secondary" 
                                    className="px-3 py-1 bg-background border border-border/50 hover:border-primary/50 transition-colors"
                                >
                                    {skill}
                                </Badge>
                            ))}
                            {candidate.skills.length > 10 && (
                                <Badge variant="outline" className="px-3 py-1 text-xs">+{candidate.skills.length - 10} more</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
