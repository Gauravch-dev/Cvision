"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import JobCardsList, { JobRequirement } from "@/components/dashboard/JobCardsList";
import { History as HistoryIcon, Loader2 } from "lucide-react";

export default function HistoryPage() {
    const [jobs, setJobs] = useState<JobRequirement[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://127.0.0.1:5000/api/job-requirements");
            if (res.ok) {
                const data = await res.json();
                // Filter for OFFLINE jobs only
                const offlineJobs = data.data.filter((job: JobRequirement) => job.status === 'offline');
                setJobs(offlineJobs);
            } else {
                toast.error("Failed to load history");
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleStatusChange = async (job: JobRequirement, status: string) => {
        // Optimistic update (remove from history if marked online)
        setJobs(jobs.filter(j => j._id !== job._id));
        toast.success(`Job restored to ${status}`);

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/job-requirements/${job._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error("Failed to update status");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
            fetchJobs(); // Revert
        }
    };

    // Placeholder handlers since we reuse JobCardsList
    // In history, we primarily want to view or restore. 
    // Uploading/viewing profiles might be better suited for the main dashboard, 
    // but keeping them functional is fine too.
    const handleUploadResumes = (job: JobRequirement) => {
        toast.info("Please restore job to Online to upload resumes.");
    };

    const handleViewProfile = (job: JobRequirement) => {
        toast.info("Please restore job to Online to view profiles.");
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Previous Job Requirements</h1>
                <p className="text-muted-foreground">View your history of offline job postings.</p>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 rounded-xl border bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="size-24 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-6">
                        <HistoryIcon className="size-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No history yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Jobs you mark as "Offline" will appear here.
                    </p>
                </div>
            ) : (
                <JobCardsList
                    jobs={jobs}
                    onUploadResumes={handleUploadResumes}
                    onViewProfile={handleViewProfile}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}
