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
      // Store job data
      setJobData({
        jobTitle,
        jobDescription,
        skills,
        experience,
        location: "Bangalore, India", // Can make this dynamic later
        salaryRange: "₹12L - ₹20L" // Can make this dynamic later
      });

      // Try backend connection (optional)
      try {
        const jobReqResponse = await fetch(
          "http://127.0.0.1:8000/api/job-requirements",
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
            }),
          }
        );

        if (jobReqResponse.ok) {
          const jobReqData = await jobReqResponse.json();
          console.log("Job saved:", jobReqData.data._id);
        }
      } catch (backendError) {
        console.log("Backend not available, using mock data");
      }

      // Generate enriched candidate profiles
      const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);
      const candidateNames = [
        "Sarah Chen", "Alex Martinez", "James Wilson", "Priya Sharma",
        "Michael Brown", "Emily Davis", "Raj Patel", "Lisa Anderson",
        "David Kim", "Jessica Taylor"
      ];

      const titles = [
        `Senior ${jobTitle}`, `Lead ${jobTitle}`, jobTitle,
        `${jobTitle} II`, `${jobTitle} III`
      ];

      const locations = [
        "Mumbai, India", "Bangalore, India", "Pune, India",
        "Delhi, India", "Hyderabad, India"
      ];

      const mockCandidates: CandidateProfile[] = files
        .slice(0, Math.min(files.length, candidateCount))
        .map((file, index) => {
          const baseScore = 95 - (index * 7);
          const actualScore = Math.max(62, baseScore + Math.floor(Math.random() * 8));
          const matchedSkillsCount = Math.max(1, skillsList.length - Math.floor(index / 2));
          const yearsExp = 2 + index + Math.floor(Math.random() * 4);

          return {
            id: `candidate-${index + 1}`,
            name: candidateNames[index % candidateNames.length],
            title: titles[index % titles.length],
            location: locations[index % locations.length],
            experience: yearsExp,
            salaryRange: `₹${8 + index * 2}L - ₹${14 + index * 3}L`,
            score: actualScore,
            contact: {
              email: `${candidateNames[index % candidateNames.length].toLowerCase().replace(' ', '.')}@example.com`,
              phone: `+91 ${90000 + index * 1111} ${10000 + index * 111}`,
            },
            about: index === 0
              ? `${yearsExp}+ years of experience in ${jobTitle.toLowerCase()}. Strong background in ${skillsList.slice(0, 3).join(', ')}. Proven track record of delivering high-quality solutions and leading cross-functional teams.`
              : `Experienced ${jobTitle.toLowerCase()} with ${yearsExp} years in the industry. Skilled in ${skillsList.slice(0, 2).join(' and ')}. Passionate about creating impactful solutions and continuous learning.`,
            skills: [
              ...skillsList.slice(0, matchedSkillsCount),
              ...(index === 0 ? ["Leadership", "Problem Solving", "Agile"] :
                index === 1 ? ["Team Player", "Communication", "CI/CD"] :
                  index === 2 ? ["Code Review", "Mentoring"] :
                    ["Collaboration"])
            ],
            radarScores: {
              skills: Math.min(100, actualScore + Math.floor(Math.random() * 10)),
              experience: Math.min(100, 70 + yearsExp * 5 + Math.floor(Math.random() * 10)),
              communication: Math.min(100, 75 + Math.floor(Math.random() * 20)),
              culture: Math.min(100, 80 + Math.floor(Math.random() * 15)),
              roleFit: Math.min(100, actualScore - 5 + Math.floor(Math.random() * 10)),
            },
          };
        });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      setCandidates(mockCandidates);
      setViewState("results");

      toast.success("Analysis complete!", {
        description: `Successfully analyzed ${mockCandidates.length} candidate${mockCandidates.length > 1 ? 's' : ''}`,
        id: "processing-toast"
      });
    } catch (error) {
      console.error("Error processing resumes:", error);

      toast.error("Processing failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        id: "processing-toast"
      });
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
