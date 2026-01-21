"use client";

import { useState, useEffect } from "react";
import UploadPanel from "@/components/dashboard/UploadPanel";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { CandidateProfile } from "@/components/dashboard/CandidateModal";
import { toast } from "sonner";

type ViewState = "form" | "results";

interface JobData {
  jobTitle: string;
  jobDescription: string;
  skills: string;
  experience: string;
  location: string;
  salaryRange: string;
}

export default function DashboardPage() {
  const [viewState, setViewState] = useState<ViewState>("form");
  const [processing, setProcessing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);

  useEffect(() => {
    setTimeout(() => setInitialLoading(false), 1000);
  }, []);

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
    if (!files.length) {
      toast.error("No files selected", {
        description: "Please upload at least one resume to continue."
      });
      return;
    }

    setProcessing(true);
    setCandidates([]);

    toast.loading("Processing resumes...", {
      description: "Analyzing candidates and matching requirements",
      id: "processing-toast"
    });

    try {
      // 1. Generate Job Embeddings
      let jobEmbeddings = null;
      try {
        const embedResponse = await fetch("http://127.0.0.1:8000/embed-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle,
            jobDescription,
            skills,
            experience
          }),
        });

        if (!embedResponse.ok) {
          throw new Error(`Job embedding failed: ${embedResponse.statusText}`);
        }

        const embedData = await embedResponse.json();
        jobEmbeddings = embedData.embeddings;
        console.log("Job Embeddings generated.");

      } catch (err) {
        console.error("Failed to generate job embeddings", err);
        toast.error("Analysis Failed", {
          description: "Visual AI Service is offline. Please check Python backend.",
          id: "processing-toast"
        });
        setProcessing(false);
        return; // STOP EXECUTION
      }

      // 2. Upload & Parse Resumes
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("http://127.0.0.1:8000/extract-resume", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          return { file: file.name, success: true, db_id: data.db_id };
        } catch (e) {
          console.error(`Failed to upload ${file.name}`, e);
          return { file: file.name, success: false };
        }
      });

      await Promise.all(uploadPromises);
      console.log("All resumes processed.");

      // 3. Store Job Data in Backend
      setJobData({
        jobTitle,
        jobDescription,
        skills,
        experience,
        location: "Bangalore, India",
        salaryRange: "₹12L - ₹20L"
      });

      try {
        const jobReqResponse = await fetch(
          "http://127.0.0.1:5000/api/job-requirements",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobTitle,
              jobDescription,
              skills,
              experience,
              candidateCount,
              resumeCount: files.length,
              embeddings: jobEmbeddings // Save embeddings too
            }),
          }
        );

        if (jobReqResponse.ok) {
          const jobReqData = await jobReqResponse.json();
          const jobId = jobReqData.data._id;
          console.log("Job saved:", jobId);

          // 4. Fetch Real Recommendations
          toast.loading("Calculating match scores...", { id: "processing-toast" }); // This toast should appear

          console.log(`Fetching recommendations for Job ID: ${jobId}`);
          const recResponse = await fetch(`http://127.0.0.1:5000/api/recommendations/${jobId}`);
          console.log("Recommendation response received:", recResponse.status);

          if (recResponse.ok) {
            const recData = await recResponse.json();
            const matches = recData.data;

            // Map Backend Data to Frontend Interface
            const realCandidates: CandidateProfile[] = matches.map((match: any, index: number) => {
              const pData = match.parsed_data || {};
              const pInfo = pData.personal_info || {};

              // Safe defaults
              const name = pInfo.name || match.filename || `Candidate ${index + 1}`;
              const email = pInfo.email || "No email";
              const phone = pInfo.phone || "No phone";
              // Try to find most recent role
              const lastRole = pData.work_experience?.[0]?.job_title || "Applicant";
              const totalExp = pData.total_experience || 0;

              return {
                id: match._id,
                name: name,
                title: lastRole, // Could map to specific title
                location: pInfo.address || "Unknown Location",
                experience: typeof totalExp === 'number' ? totalExp : parseFloat(totalExp) || 0,
                salaryRange: "Not disclosed", // Not extracted currently
                score: match.matchScore,
                contact: { email, phone },
                about: `Matched for ${jobTitle} position. Skills matched: ${match.matchDetails?.skills}%`,
                skills: (Array.isArray(pData.skills)
                  ? pData.skills
                  : typeof pData.skills === 'string'
                    ? pData.skills.split(',').map((s: string) => s.trim())
                    : []).slice(0, 10), // Limit bubbles
                radarScores: {
                  skills: match.matchDetails?.skills || 0,
                  experience: match.matchDetails?.experience || 0,
                  communication: match.matchDetails?.phrases || 0, // Mapping phrases to communication proxy
                  culture: match.matchDetails?.phrases || 0, // Mapping phrases to culture proxy
                  roleFit: match.matchDetails?.full_text || 0,
                },
              };
            });

            setCandidates(realCandidates);
            setViewState("results");

            toast.success("Analysis complete!", {
              description: `Successfully analyzed ${files.length} resumes. Found ${realCandidates.length} matches.`,
              id: "processing-toast"
            });
          } else {
            throw new Error("Failed to fetch recommendations");
          }

        } else {
          throw new Error("Failed to save job requirement");
        }
      } catch (backendError) {
        console.error("Backend Error:", backendError);
        toast.error("Analysis Failed", {
          description: "Could not retrieve recommendations. Ensure backend is running.",
          id: "processing-toast"
        });
      }
    } catch (error) {
      console.error("Processing Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToForm = () => {
    setViewState("form");
    setCandidates([]);
    setJobData(null);
  };

  if (initialLoading) {
    return (
      <div className="pt-10">
        <LoadingSkeleton />
      </div>
    );
  }

  // Show Analytics Dashboard
  if (viewState === "results" && candidates.length > 0 && jobData) {
    // Generate analytics data
    const analyticsData = {
      jobTitle: jobData.jobTitle,
      location: jobData.location,
      experienceRange: jobData.experience,
      salaryRange: jobData.salaryRange,
      postedDaysAgo: 2,
      totalApplicants: candidates.length,
      avgMatchScore: Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length),
      matchDistribution: [
        { range: "0-20%", count: candidates.filter(c => c.score < 20).length },
        { range: "20-40%", count: candidates.filter(c => c.score >= 20 && c.score < 40).length },
        { range: "40-60%", count: candidates.filter(c => c.score >= 40 && c.score < 60).length },
        { range: "60-80%", count: candidates.filter(c => c.score >= 60 && c.score < 80).length },
        { range: "80-100%", count: candidates.filter(c => c.score >= 80).length },
      ],
      activityByDay: [
        { day: "Mon", count: Math.floor(candidates.length * 0.1) },
        { day: "Tue", count: Math.floor(candidates.length * 0.15) },
        { day: "Wed", count: Math.floor(candidates.length * 0.25) },
        { day: "Thu", count: Math.floor(candidates.length * 0.3) },
        { day: "Fri", count: Math.floor(candidates.length * 0.15) },
        { day: "Sat", count: Math.floor(candidates.length * 0.03) },
        { day: "Sun", count: Math.floor(candidates.length * 0.02) },
      ],
      candidates,
    };

    return <AnalyticsDashboard data={analyticsData} onBack={handleBackToForm} />;
  }

  // Show Form
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Generate Analysis</h1>
        <p className="text-muted-foreground">Upload resumes and define requirements to find your perfect candidate.</p>
      </div>

      <UploadPanel onGenerate={handleGenerate} disabled={processing} />

      {processing && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Analyzing candidates...</p>
          </div>
        </div>
      )}
    </div>
  );
}
