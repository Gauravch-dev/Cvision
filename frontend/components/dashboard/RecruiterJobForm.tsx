"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Multi-tenancy: Get current user
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Briefcase, Wrench } from "lucide-react";
import { toast } from "sonner";

interface JobFormProps {
    onSuccess: () => void;
}

export default function RecruiterJobForm({ onSuccess }: JobFormProps) {
    const { user } = useUser(); // Multi-tenancy: Get logged-in user
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [experience, setExperience] = useState("");
    const [loading, setLoading] = useState(false);

    const SKILL_SUGGESTIONS = [
        "React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL",
        "SQL", "Python", "Java", "Spring Boot", "Docker", "AWS", "Git", "REST APIs"
    ];

    const addSkill = (skill: string) => {
        if (selectedSkills.includes(skill)) return;
        setSelectedSkills([...selectedSkills, skill]);
        setSkillInput("");
    };

    const removeSkill = (skill: string) => {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    };

    const canSubmit =
        jobTitle.trim() &&
        jobDescription.trim().length >= 20 &&
        selectedSkills.length > 0 &&
        experience.trim();

    const handleSubmit = async () => {
        if (!canSubmit) return;

        setLoading(true);
        toast.loading("Creating job requirement...", { id: "job-create" });

        try {
            // 1. Generate Job Embeddings (EXISTING LOGIC)
            const embedResponse = await fetch("http://127.0.0.1:8000/embed-job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobTitle,
                    jobDescription,
                    skills: selectedSkills.join(", "),
                    experience
                }),
            });

            if (!embedResponse.ok) {
                throw new Error("Failed to generate job embeddings");
            }

            const embedData = await embedResponse.json();

            // 2. Save Job Requirement (EXISTING LOGIC)
            const jobResponse = await fetch("http://127.0.0.1:5000/api/job-requirements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id, // Multi-tenancy: Link job to current user
                    jobTitle,
                    jobDescription,
                    skills: selectedSkills.join(", "),
                    experience,
                    candidateCount: 0,
                    resumeCount: 0,
                    embeddings: embedData.embeddings
                }),
            });

            if (!jobResponse.ok) {
                throw new Error("Failed to save job requirement");
            }

            toast.success("Job requirement created!", {
                description: "You can now upload resumes for this position",
                id: "job-create"
            });

            // Reset form
            setJobTitle("");
            setJobDescription("");
            setSelectedSkills([]);
            setExperience("");

            onSuccess();
        } catch (error) {
            console.error("Error creating job:", error);
            toast.error("Failed to create job requirement", {
                description: "Please ensure backend services are running",
                id: "job-create"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-2xl border-primary/10 bg-card/50 backdrop-blur-xl relative overflow-hidden">


            <CardContent className="p-8 lg:p-10 space-y-8 relative z-10">
                {/* HEADER */}
                <div className="space-y-2 border-b border-border/50 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Sparkles className="size-4 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-primary uppercase tracking-wider">
                            New Job Requirement
                        </p>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Define Job Requirements
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Create a job requirement first, then upload resumes to find the perfect candidates.
                    </p>
                </div>

                {/* JOB DETAILS */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center border">
                            <Briefcase className="text-foreground size-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Job Details</h3>
                            <p className="text-sm text-muted-foreground">Define what you're looking for</p>
                        </div>
                    </div>

                    <div className="space-y-6 bg-card/50 p-6 rounded-2xl border border-border/50">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Job Title</label>
                            <Input
                                className="bg-background/50"
                                placeholder="e.g. Senior Frontend Engineer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex justify-between">
                                <span>Job Description</span>
                                <span className="text-xs text-muted-foreground font-normal">Min 20 chars</span>
                            </label>
                            <Textarea
                                className="min-h-[120px] bg-background/50 resize-y"
                                placeholder="Paste the full job description here..."
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Experience Required</label>
                            <Input
                                className="bg-background/50"
                                placeholder="e.g. 3-5 Years"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* SKILLS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Wrench size={18} className="text-primary" />
                        <h3 className="font-semibold">Required Skills</h3>
                    </div>

                    <div className="p-6 rounded-2xl border border-border/50 bg-muted/20 space-y-4">
                        <Input
                            className="bg-background/80"
                            placeholder="Type to search skills (e.g. React, Python, AWS)..."
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (skillInput.trim()) {
                                        addSkill(skillInput.trim());
                                    }
                                }
                            }}
                            disabled={loading}
                        />

                        <div className="flex flex-wrap gap-2">
                            {SKILL_SUGGESTIONS.filter(
                                (skill) =>
                                    skill.toLowerCase().includes(skillInput.toLowerCase()) &&
                                    !selectedSkills.includes(skill)
                            )
                                .slice(0, 10)
                                .map((skill) => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => addSkill(skill)}
                                        className="px-3 py-1.5 rounded-lg border bg-background text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                                        disabled={loading}
                                    >
                                        + {skill}
                                    </button>
                                ))}
                        </div>

                        {selectedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50 mt-4">
                                {selectedSkills.map((skill) => (
                                    <span
                                        key={skill}
                                        onClick={() => !loading && removeSkill(skill)}
                                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                                    >
                                        {skill}
                                        <span className="text-primary/40 group-hover:text-destructive">×</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* SUBMIT */}
                <div className="pt-6 border-t border-border/50">
                    <Button
                        size="lg"
                        className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl"
                        disabled={!canSubmit || loading}
                        onClick={handleSubmit}
                    >
                        <Sparkles className="mr-2 size-5" />
                        {loading ? "Creating..." : "Save Job Requirement"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
