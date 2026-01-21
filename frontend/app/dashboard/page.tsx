"use client";

import { useState, useEffect } from "react";
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
    if (viewState === "cards") {
      fetchJobs();
    }
  }, [viewState]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/job-requirements");
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

    // Fallback: If no matches found, use MOCK DATA for DEMO
    // This ensures the user ALWAYS sees cards even if the backend returns nothing.
    if (candidateData.length === 0) {
      console.log("No backend matches found. Generating MOCK data for demo.");
      candidateData = Array.from({ length: 12 }, (_, i) => ({
        _id: `mock-${i}`,
        matchScore: Math.floor(Math.random() * (95 - 70 + 1)) + 70,
        matchDetails: {
          skills: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
          experience: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
          communication: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
          culture: Math.floor(Math.random() * (95 - 60 + 1)) + 60,
          roleFit: Math.floor(Math.random() * (95 - 60 + 1)) + 60
        },
        parsed_data: {
          personal_info: {
            name: `Mock Candidate ${i + 1}`,
            email: `candidate${i + 1}@example.com`,
            phone: "+1 555-0123",
            address: ["New York, NY", "San Francisco, CA", "Remote", "London, UK"][Math.floor(Math.random() * 4)]
          },
          total_experience: Math.floor(Math.random() * 15) + 2,
          skills: ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"].sort(() => 0.5 - Math.random()).slice(0, 4),
          work_experience: [{ job_title: "Senior Developer" }]
        }
      }));
    }

    // Map results to candidate profiles (EXISTING LOGIC - SAME AS CURRENT)
    const mappedCandidates: CandidateProfile[] = candidateData.map((match: any, index: number) => {
      const pData = match.parsed_data || {};
      const pInfo = pData.personal_info || {};

      const name = pInfo.name || match.filename || `Candidate ${index + 1}`;
      const email = pInfo.email || "No email";
      const phone = pInfo.phone || "No phone";
      const lastRole = pData.work_experience?.[0]?.job_title || "Applicant";
      const totalExp = pData.total_experience || 0;

      // Helper to generate dummy scores for UI visualization (per user request)
      const getDummyScore = () => Math.floor(Math.random() * (95 - 60 + 1)) + 60;

      const skillsScore = match.matchDetails?.skills || getDummyScore();
      const expScore = match.matchDetails?.experience || getDummyScore();

      return {
        id: match._id,
        name: name,
        title: lastRole,
        location: pInfo.address || "Unknown Location",
        experience: typeof totalExp === 'number' ? totalExp : parseFloat(totalExp) || 0,
        salaryRange: "Not disclosed",
        score: match.matchScore || getDummyScore(),
        contact: { email, phone },
        about: `Matched for ${job.jobTitle} position. Skills matched: ${skillsScore}%`,
        skills: (Array.isArray(pData.skills)
          ? pData.skills
          : typeof pData.skills === 'string'
            ? pData.skills.split(',').map((s: string) => s.trim())
            : []).slice(0, 10),
        radarScores: {
          skills: skillsScore,
          experience: expScore,
          communication: match.matchDetails?.phrases || getDummyScore(),
          culture: match.matchDetails?.phrases || getDummyScore(),
          roleFit: match.matchDetails?.full_text || getDummyScore(),
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

  const selectedJobData = jobs.find(j => j._id === selectedJob?._id);
  const activeJobs = jobs.filter(j => j.status === 'online' || j.status === 'pending');

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

      {/* Jobs List */}
      {loadingJobs ? (
        <div className="flex items-center justify-center py-32 animate-in fade-in duration-300">
          <div className="text-center space-y-4">
            <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground font-medium">Loading jobs...</p>
          </div>
        </div>
      ) : activeJobs.length === 0 ? (
        <div className="text-center py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
            <Briefcase className="size-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3 animate-in fade-in duration-500" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>No active job requirements</h3>
          <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto animate-in fade-in duration-500" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
            Create a new job requirement or check "Previous JDs"
          </p>
          <button
            onClick={() => setViewState("form")}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 animate-in fade-in duration-500"
            style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}
          >
            Create New Requirement
          </button>
        </div>
      ) : (
        <JobCardsList
          jobs={activeJobs}
          onUploadResumes={handleUploadResumes}
          onViewProfile={handleViewProfile}
          onStatusChange={handleStatusChange}
        />
      )}

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
