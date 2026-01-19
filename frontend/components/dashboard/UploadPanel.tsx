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
    <Card className="shadow-lg">
      <CardContent className="p-10 space-y-12">
        {/* HEADER */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Step 1 of 2
          </p>
          <h2 className="text-2xl font-semibold">
            Create Shortlist Analysis
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl">
            Upload resumes and define hiring criteria. We’ll intelligently rank
            candidates based on relevance.
          </p>
        </div>

        {/* RESUME UPLOAD */}
        <div className="rounded-2xl border bg-muted/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <UploadCloud className="text-primary" size={20} />
            <h3 className="font-semibold">Resume Upload</h3>
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
            className="cursor-pointer rounded-xl border-2 border-dashed p-6 text-center hover:border-primary transition"
          >
            <p className="font-medium">Drop resumes here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-1">
              PDF or DOCX • Bulk supported
            </p>

            {files.length > 0 && (
              <p className="mt-3 text-sm font-medium text-primary">
                {files.length} resumes ready for analysis
              </p>
            )}
          </div>
        </div>

        {/* JOB DETAILS */}
        <div className="rounded-2xl border bg-muted/40 p-6 space-y-8">
          <div className="flex items-center gap-2">
            <Briefcase className="text-primary" size={20} />
            <h3 className="font-semibold">Job Requirements</h3>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <Input
              placeholder="Frontend Developer, Backend Engineer, etc."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          {/* JD */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Description</label>
            <Textarea
              className="min-h-[120px]"
              placeholder="Key responsibilities, tech stack, expectations…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Used to infer skills and relevance
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench size={16} />
              <label className="text-sm font-medium">Core Skills</label>
            </div>

            <Input
              placeholder="Type to search or select below"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              {SKILL_SUGGESTIONS.filter(
                (skill) =>
                  skill.toLowerCase().includes(skillInput.toLowerCase()) &&
                  !selectedSkills.includes(skill)
              )
                .slice(0, 8)
                .map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    className="px-3 py-1 rounded-full border text-sm hover:bg-primary hover:text-primary-foreground transition"
                  >
                    {skill}
                  </button>
                ))}
            </div>

            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    onClick={() => removeSkill(skill)}
                    className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-sm cursor-pointer shadow hover:scale-105 transition"
                  >
                    {skill} ✕
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Required Experience</label>
            <Input
              placeholder="e.g. 2 years or Fresher"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          {/* Shortlist */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <label className="text-sm font-medium">
                Desired Shortlist Size
              </label>
            </div>
            <Input
              type="number"
              min={1}
              value={candidateCount}
              onChange={(e) => setCandidateCount(Number(e.target.value))}
            />
          </div>
        </div>

        {/* ACTION */}
        <div className="pt-6 border-t space-y-3">
          <Button
            size="lg"
            className="w-full h-14 text-lg shadow-md"
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
            <Sparkles className="mr-2" />
            Generate Smart Shortlist
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Analysis usually completes within seconds
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
