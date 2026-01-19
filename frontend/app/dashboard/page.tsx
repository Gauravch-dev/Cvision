"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import UploadPanel from "@/components/dashboard/UploadPanel";
import ProcessingStatus from "@/components/dashboard/ProcessingStatus";
import ResultsList from "@/components/dashboard/ResultsList";
import CandidateInsights from "@/components/dashboard/CandidateInsights";
import EmptyState from "@/components/dashboard/EmptyState";

export interface Candidate {
  id: string;
  name: string;
  score: number;
  experience: number;
  skills: string[];
  breakdown?: {
    matchedSkills: string[];
    missingSkills: string[];
    reasoning: string;
  };
}

export default function DashboardPage() {
  const [processing, setProcessing] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [jobRequirementId, setJobRequirementId] = useState<string | null>(null);

  const handleGenerate = async ({
    files,
    jobTitle,
    jobDescription,
    skills,
    experience,
    candidateCount,
  }: {
    files: File[];
    jobTitle: string;
    jobDescription: string;
    skills: string;
    experience: string;
    candidateCount: number;
  }) => {
    if (!files.length) return;

    setProcessing(true);
    setCandidates([]);
    setSelected(null);

    try {
      const jobReqResponse = await fetch(
        "http://127.0.0.1:8000/api/job-requirements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobTitle,
            jobDescription,
            skills,
            experience,
            candidateCount,
            resumeCount: files.length,
          }),
        }
      );

      if (!jobReqResponse.ok) {
        throw new Error("Failed to save job requirements");
      }

      const jobReqData = await jobReqResponse.json();
      const savedJobReqId = jobReqData.data._id;
      setJobRequirementId(savedJobReqId);

      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("jobRequirementId", savedJobReqId);

      const resumeResponse = await fetch(
        "http://127.0.0.1:8000/extract-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!resumeResponse.ok) {
        throw new Error("Resume processing failed");
      }

      await resumeResponse.json();

      await fetch(
        `http://127.0.0.1:8000/api/job-requirements/${savedJobReqId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "processing",
          }),
        }
      );

      const mockCandidates: Candidate[] = [
        {
          id: "1",
          name: files[0].name.replace(".pdf", ""),
          score: 85,
          experience: 3,
          skills: ["Resume Parsed", "Backend Connected", "MongoDB Saved"],
          breakdown: {
            matchedSkills: ["Resume Parsed", "MongoDB Integration"],
            missingSkills: ["Scoring Logic"],
            reasoning:
              "Job requirements saved to MongoDB. Resume processed successfully.",
          },
        },
      ];

      setCandidates(mockCandidates);

      await fetch(
        `http://127.0.0.1:8000/api/job-requirements/${savedJobReqId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "completed",
          }),
        }
      );
    } catch (error) {
      if (jobRequirementId) {
        await fetch(
          `http://127.0.0.1:8000/api/job-requirements/${jobRequirementId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "failed",
            }),
          }
        );
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <UploadPanel onGenerate={handleGenerate} disabled={processing} />

      {processing && <ProcessingStatus />}

      {!processing && candidates.length === 0 && <EmptyState />}

      {!processing && candidates.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <ResultsList
              candidates={candidates}
              selectedId={selected?.id}
              onSelect={setSelected}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {selected ? (
                <CandidateInsights candidate={selected} />
              ) : (
                <div className="border rounded-xl p-6 text-muted-foreground text-sm">
                  Select a candidate to view insights
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
