"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function JobFormPanel({
  onGenerate,
  disabled,
}: {
  onGenerate: (data: {
    jobTitle: string;
    jobDescription: string;
    skills: string;
    candidateCount: number;
  }) => void;
  disabled?: boolean;
}) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [candidateCount, setCandidateCount] = useState(5);

  const canGenerate =
    jobTitle.trim() &&
    jobDescription.trim().length >= 20 &&
    skills.trim() &&
    candidateCount > 0;

  return (
    <Card>
      <CardContent className="p-8 space-y-6">
        <h2 className="text-2xl font-semibold">Job Details</h2>

        <Input
          placeholder="Job Title (e.g. Frontend Developer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />

        <Textarea
          placeholder="Job Description (minimum 20 characters)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <Input
          placeholder="Skills (e.g. React, Node, SQL)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <Input
          type="number"
          min={1}
          placeholder="Number of candidates"
          value={candidateCount}
          onChange={(e) => setCandidateCount(Number(e.target.value))}
        />

        <Button
          className="w-full"
          disabled={!canGenerate || disabled}
          onClick={() =>
            onGenerate({
              jobTitle,
              jobDescription,
              skills,
              candidateCount,
            })
          }
        >
          Generate
        </Button>
      </CardContent>
    </Card>
  );
}
