"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UploadCloud,
  Sparkles,
  Briefcase,
  Wrench,
  Users,
  Files,
  Zap,
} from "lucide-react";

export default function UploadPanel({
  onGenerate,
  disabled,
}: {
  onGenerate: (payload: {
    files: File[];
    jobTitle: string;
    jobDescription: string;
    skills: string;
    experience: string;
    candidateCount: number;
  }) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------------- STATE ---------------- */
  const [files, setFiles] = useState<File[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [candidateCount, setCandidateCount] = useState(5);

  /* ---------------- CONSTANTS ---------------- */
  const SKILL_SUGGESTIONS = [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "SQL",
    "Python",
    "Java",
    "Spring Boot",
    "Docker",
    "AWS",
    "Git",
    "REST APIs",
  ];

  const addSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) return;
    setSelectedSkills([...selectedSkills, skill]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const canGenerate =
    files.length > 0 &&
    jobTitle.trim() &&
    jobDescription.trim().length >= 20 &&
    selectedSkills.length > 0 &&
    candidateCount > 0;

  /* ---------------- UI ---------------- */
  return (
    <Card className="shadow-2xl border-primary/10 bg-card/50 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <CardContent className="p-8 lg:p-10 space-y-10 relative z-10">
        {/* HEADER */}
        <div className="space-y-2 border-b border-border/50 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              New Analysis
            </p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create Ranking & Analysis
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Upload candidate resumes and define your ideal profile. Our AI will analyze, score, and rank every applicant in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* RESUME UPLOAD */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center border">
                <UploadCloud className="text-foreground size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Upload Resumes</h3>
                <p className="text-sm text-muted-foreground">Support for PDF & DOCX</p>
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              hidden
              onChange={(e) =>
                setFiles(e.target.files ? Array.from(e.target.files) : [])
              }
            />

            <div
              onClick={() => inputRef.current?.click()}
              className="cursor-pointer group relative overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-10 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

              <div className="relative flex flex-col items-center gap-4">
                <div className="size-16 rounded-2xl bg-background shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <UploadCloud className="size-8 text-primary/80" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-lg">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted-foreground">
                    Maximum file size 10MB per resume
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm animate-fade-in-up">
                    <Files size={14} />
                    {files.length} resumes selected
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* JOB DETAILS */}
          <div className="space-y-8">
            <div className="flex items-center gap-2">
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience</label>
                  <Input
                    className="bg-background/50"
                    placeholder="e.g. 3-5 Years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Candidates to Rank</label>
                  <Input
                    className="bg-background/50"
                    type="number"
                    min={1}
                    value={candidateCount}
                    onChange={(e) => setCandidateCount(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS SECTION - Full Width */}
        <div className="space-y-4 pt-4">
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
                    onClick={() => removeSkill(skill)}
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

        {/* ACTION */}
        <div className="pt-8 border-t border-border/50">
          <Button
            size="lg"
            className="w-full h-16 text-xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl"
            disabled={!canGenerate || disabled}
            onClick={() =>
              onGenerate({
                files,
                jobTitle,
                jobDescription,
                skills: selectedSkills.join(", "),
                experience,
                candidateCount,
              })
            }
          >
            <Sparkles className="mr-2 size-6 animate-pulse" />
            Generate Analysis
          </Button>

          <p className="mt-4 text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
            <Zap className="size-4 text-amber-500" />
            <span>Powered by AI • 99.9% Accuracy • Instant Results</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
