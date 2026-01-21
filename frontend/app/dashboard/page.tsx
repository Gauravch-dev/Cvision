"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Multi-tenancy: Get current user
import RecruiterJobForm from "@/components/dashboard/RecruiterJobForm";
import JobCardsList, { JobRequirement } from "@/components/dashboard/JobCardsList";
import RecruiterResumeModal from "@/components/dashboard/RecruiterResumeModal";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { CandidateProfile } from "@/components/dashboard/CandidateModal";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";
import { toast } from "sonner";
import { Plus, Briefcase, ArrowLeft } from "lucide-react";

type ViewState = "cards" | "form" | "analytics";

interface JobData {
  jobTitle: string;
  jobDescription: string;
  skills: string;
  experience: string;
  location: string;
  salaryRange: string;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser(); // Multi-tenancy: Get current user
  const [viewState, setViewState] = useState<ViewState>("cards");
  const [initialLoading, setInitialLoading] = useState(true);
  const [jobs, setJobs] = useState<JobRequirement[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Resume Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobRequirement | null>(null);

  // Analytics
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [jobData, setJobData] = useState<JobData | null>(null);

  useEffect(() => {
    setTimeout(() => setInitialLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (viewState === "cards" && isLoaded && user?.id) {
      fetchJobs();
    }
  }, [viewState, isLoaded, user?.id]);

  const fetchJobs = async () => {
    if (!user?.id) return; // Multi-tenancy: Require user ID

    setLoadingJobs(true);
    try {
      // Multi-tenancy: Filter by current user's ID
      const response = await fetch(`http://127.0.0.1:5000/api/job-requirements?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load job requirements");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleFormSuccess = () => {
    setViewState("cards");
    toast.success("Redirecting to job cards...");
  };

  const handleUploadResumes = (job: JobRequirement) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  /*
   * VIEW PROFILES HANDLER
   * Fetches recommendations and displays them in the Analytics Dashboard.
   * Explicitly passes 'job' to handleUploadSuccess to avoid async state race conditions.
   */
  const handleViewProfile = async (job: JobRequirement) => {
    setSelectedJob(job);
    toast.loading("Loading profiles...", { id: "view-profile" });

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/recommendations/${job._id}`);
      if (res.ok) {
        const data = await res.json();
        // Pass 'job' explicitly to ensure correct context is used immediately
        handleUploadSuccess(data.data, job);
        toast.success("Profiles loaded", { id: "view-profile" });
      } else {
        throw new Error("Failed to fetch profiles");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load profiles", { id: "view-profile" });
      // Fallback to empty (triggering mock data generation inside handleUploadSuccess)
      handleUploadSuccess([], job);
    }
  };

  const handleStatusChange = async (job: JobRequirement, status: string) => {
    // Optimistic update
    setJobs(jobs.map(j => j._id === job._id ? { ...j, status } : j));

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/job-requirements/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        toast.success(`Job marked as ${status}`);
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
      fetchJobs(); // Revert on error
    }
  };

  /*
   * UPLOAD SUCCESS / DATA PROCESSING HANDLER
   * Processes backend matches or generates mock data for the dashboard.
   * Accepts 'jobOverride' to support direct calls from handleViewProfile.
   */
  const handleUploadSuccess = (matches: any[], jobOverride?: JobRequirement) => {
    setModalOpen(false);

    // CRITICAL FIX: Use jobOverride if provided, otherwise fallback to state
    // This prevents race conditions where selectedJob state hasn't updated yet.
    const job = jobOverride || selectedJob;

    if (!job) {
      console.error("No job selected in handleUploadSuccess");
      return;
    }

    let candidateData = matches && matches.length > 0 ? matches : [];

    // Fallback: If no matches found, do NOT generate mock data.
    // User wants REAL TIME data. If 0 matches, show 0 matches.
    if (candidateData.length === 0) {
      console.log("No backend matches found. Showing empty state.");
      // We keep candidateData as []
    }

    // Map results to candidate profiles (EXISTING LOGIC - SAME AS CURRENT)
    const mappedCandidates: CandidateProfile[] = candidateData.map((match: any, index: number) => {
      const pData = match.parsed_data || {};
      // 🐛 FIX: Backend returns 'profile', not 'personal_info'
      const pInfo = pData.profile || pData.personal_info || {};

      const name = pInfo.name || match.filename?.replace(/\.[^/.]+$/, "") || `Candidate ${index + 1}`;
      const email = pInfo.email || "No email";
      const phone = pInfo.phone || "No phone";
      const lastRole = pData.work_experience?.[0]?.job_title || "Applicant";
      const totalExp = pData.total_experience || 0;

      // REAL DATA MAPPING
      // Use actual backend scores. If missing (0), show 0.

      const skillsScore = match.matchDetails?.phrases || 0;
      const expScore = match.matchDetails?.full_text || 0;

      return {
        id: match._id,
        name: name,
        title: lastRole,
        location: pInfo.location || pInfo.address || "Unknown Location",
        experience: typeof totalExp === 'number' ? totalExp : parseFloat(totalExp) || 0,
        salaryRange: "Not disclosed",
        score: match.matchScore || 0,
        contact: { email, phone },
        about: pInfo.summary || `Matched for ${job.jobTitle} position. Skills matched: ${skillsScore}%`,
        resumeUrl: `http://localhost:5000/resumes/${match.stored_filename || match.filename}`,
        skills: (Array.isArray(pData.skills?.raw) ? pData.skills.raw :
          Array.isArray(pData.skills) ? pData.skills :
            typeof pData.skills === 'string' ? pData.skills.split(',').map((s: string) => s.trim()) :
              (typeof pData.skills === 'object' && pData.skills !== null) ? Object.values(pData.skills).flat() :
                []).slice(0, 15), // Increased limit slightly to show more breadth
        radarScores: {
          skills: skillsScore,
          experience: expScore,
          education: match.matchDetails?.education || 0, // Actual education
          certification: match.matchDetails?.skills || 0, // Using actual skills score as proxy for Certification
        },
      };
    });

    setCandidates(mappedCandidates);
    setJobData({
      jobTitle: job.jobTitle,
      location: "Bangalore, India",
      experienceRange: job.experience,
      salaryRange: "₹12L - ₹20L",
      postedDaysAgo: 2,
    } as any);
    setViewState("analytics");
  };

  // FILTERING LOGIC: Strict separation between Active (Online/Pending) and Past (Offline/Closed)
  // This ensures a job is never visible in both lists simultaneously.
  const activeJobs = jobs.filter(j => j.status === 'online' || j.status === 'pending');
  const pastJobs = jobs.filter(j => !['online', 'pending'].includes(j.status || '')); // Capture EVERYTHING else (offline, completed, failed, closed)

  if (initialLoading) {
    return (
      <div className="pt-10">
        <LoadingSkeleton />
      </div>
    );
  }



  // (Redoing Replacement Content logic for safety)



  const handleBackToCards = () => {
    setViewState("cards");
    setCandidates([]);
    setJobData(null);
    setSelectedJob(null);
  };



  // ANALYTICS VIEW
  if (viewState === "analytics" && candidates.length > 0 && jobData) {
    const analyticsData = {
      jobTitle: jobData.jobTitle,
      location: jobData.location,
      experienceRange: jobData.experience,  // Map experience to experienceRange for analytics
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

    return <AnalyticsDashboard data={analyticsData} onBack={handleBackToCards} />;
  }

  // FORM VIEW
  if (viewState === "form") {
    return (
      <div className="space-y-6 pb-20">
        <button
          onClick={() => setViewState("cards")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to job requirements
        </button>
        <RecruiterJobForm onSuccess={handleFormSuccess} />
      </div>
    );
  }

  // CARDS VIEW (Default)
  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your job requirements and upload resumes
          </p>
        </div>
        <button
          onClick={() => setViewState("form")}
          className="bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 flex items-center gap-2.5 group"
        >
          <Plus className="size-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Job Requirement</span>
        </button>
      </div>

      {/* Active Jobs List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight px-1">Active Requirements</h2>
        {activeJobs.length === 0 ? (
          // ... (keep empty state logic but slightly adjusted or re-used)
          <div className="text-center py-20 border-2 border-dashed border-muted rounded-3xl">
            <p className="text-muted-foreground">No active jobs found.</p>
          </div>
        ) : (
          <JobCardsList
            jobs={activeJobs}
            onUploadResumes={handleUploadResumes}
            onViewProfile={handleViewProfile}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {/* Previous JDs (Offline) - REMOVED (Moved to History Page) */}

      {/* Resume Upload Modal */}
      {selectedJob && (
        <RecruiterResumeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          job={selectedJob}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
