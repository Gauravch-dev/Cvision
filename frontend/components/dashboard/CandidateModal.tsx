"use client";

import { X, MapPin, Calendar, DollarSign, Mail, Phone, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        communication: number;
        culture: number;
        roleFit: number;
    };
    resumeUrl?: string;
}

interface CandidateModalProps {
    candidate: CandidateProfile;
    onClose: () => void;
}

export function CandidateModal({ candidate, onClose }: CandidateModalProps) {
    // Radar chart calculation
    const radarPoints = () => {
        const { skills, experience, communication, culture, roleFit } = candidate.radarScores;
        const center = 150;
        const maxRadius = 100;

        const angles = [0, 72, 144, 216, 288]; // 5 points, starting from top
        const values = [skills, experience, communication, culture, roleFit];

        return values
            .map((value, i) => {
                const angle = (angles[i] - 90) * (Math.PI / 180);
                const radius = (value / 100) * maxRadius;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                return `${x},${y}`;
            })
            .join(' ');
    };

    const radarLabels = [
        { label: 'Skills', angle: 0 },
        { label: 'Exp', angle: 72 },
        { label: 'Comm', angle: 144 },
        { label: 'Culture', angle: 216 },
        { label: 'Role Fit', angle: 288 },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-bold">Candidate Profile</h2>
                        <p className="text-sm text-muted-foreground">Detailed analysis and resume</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="size-5" />
                    </Button>
                </div>

                <div className="p-8 space-y-8">
                    {/* Profile Section */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-shrink-0">
                            <div className="size-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-3xl font-bold border-4 border-primary/10">
                                {candidate.profilePicture ? (
                                    <img src={candidate.profilePicture} alt={candidate.name} className="size-full rounded-full object-cover" />
                                ) : (
                                    candidate.name.split(' ').map(n => n[0]).join('')
                                )}
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            <div>
                                <h3 className="text-2xl font-bold">{candidate.name}</h3>
                                <p className="text-primary font-medium">{candidate.title}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="size-4" />
                                    {candidate.location}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="size-4" />
                                    {candidate.experience} years
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                                    <DollarSign className="size-4" />
                                    {candidate.salaryRange}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                        <h4 className="font-semibold mb-3">Contact</h4>
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-4 text-muted-foreground" />
                            <a href={`mailto:${candidate.contact.email}`} className="hover:text-primary transition">
                                {candidate.contact.email}
                            </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-4 text-muted-foreground" />
                            <a href={`tel:${candidate.contact.phone}`} className="hover:text-primary transition">
                                {candidate.contact.phone}
                            </a>
                        </div>
                        <Button variant="outline" className="w-full mt-2" size="sm">
                            <Download className="size-4 mr-2" />
                            Download Resume
                        </Button>
                    </div>

                    {/* Radar Chart */}
                    <div>
                        <h4 className="font-semibold mb-4">Match Analysis Radar</h4>
                        <div className="flex justify-center">
                            <svg width="300" height="300" viewBox="0 0 300 300">
                                {/* Background grid */}
                                {[20, 40, 60, 80, 100].map((percent) => (
                                    <polygon
                                        key={percent}
                                        points={radarLabels
                                            .map((_, i) => {
                                                const angle = (i * 72 - 90) * (Math.PI / 180);
                                                const radius = percent;
                                                const x = 150 + radius * Math.cos(angle);
                                                const y = 150 + radius * Math.sin(angle);
                                                return `${x},${y}`;
                                            })
                                            .join(' ')}
                                        fill="none"
                                        stroke="hsl(var(--border))"
                                        strokeWidth="1"
                                        opacity="0.3"
                                    />
                                ))}

                                {/* Axis lines */}
                                {radarLabels.map((label, i) => {
                                    const angle = (i * 72 - 90) * (Math.PI / 180);
                                    const x = 150 + 100 * Math.cos(angle);
                                    const y = 150 + 100 * Math.sin(angle);
                                    return (
                                        <line
                                            key={i}
                                            x1="150"
                                            y1="150"
                                            x2={x}
                                            y2={y}
                                            stroke="hsl(var(--border))"
                                            strokeWidth="1"
                                            opacity="0.3"
                                        />
                                    );
                                })}

                                {/* Data polygon */}
                                <polygon
                                    points={radarPoints()}
                                    fill="hsl(var(--primary))"
                                    fillOpacity="0.2"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="2"
                                />

                                {/* Data points */}
                                {radarPoints().split(' ').map((point, i) => {
                                    const [x, y] = point.split(',');
                                    return (
                                        <circle
                                            key={i}
                                            cx={x}
                                            cy={y}
                                            r="4"
                                            fill="hsl(var(--primary))"
                                        />
                                    );
                                })}

                                {/* Labels */}
                                {radarLabels.map((label, i) => {
                                    const angle = (i * 72 - 90) * (Math.PI / 180);
                                    const x = 150 + 120 * Math.cos(angle);
                                    const y = 150 + 120 * Math.sin(angle);
                                    return (
                                        <text
                                            key={i}
                                            x={x}
                                            y={y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="fill-foreground text-xs font-medium"
                                        >
                                            {label.label}
                                        </text>
                                    );
                                })}

                                {/* Legend */}
                                <text x="150" y="270" textAnchor="middle" className="fill-foreground text-xs">
                                    ● Candidate
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* About */}
                    <div>
                        <h4 className="font-semibold mb-2">About</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {candidate.about}
                        </p>
                    </div>

                    {/* Skills */}
                    <div>
                        <h4 className="font-semibold mb-3">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
