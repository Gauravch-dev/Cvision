"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs"; // Multi-tenancy: Get current user
import { X, Upload, FileText, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import type { JobRequirement } from "./JobCardsList";

interface ResumeUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: JobRequirement;
    onSuccess: (results: any[]) => void;
}

export default function RecruiterResumeModal({
    isOpen,
    onClose,
    job,
    onSuccess,
}: ResumeUploadModalProps) {
    const { user } = useUser(); // Multi-tenancy: Get current user
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            (file) => file.type === "application/pdf" || file.name.endsWith(".pdf") || file.name.endsWith(".doc") || file.name.endsWith(".docx")
        );

        if (droppedFiles.length > 0) {
            setFiles((prev) => [...prev, ...droppedFiles]);
        } else {
            toast.error("Please upload PDF or DOC files only");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error("Please select at least one resume");
            return;
        }

        setUploading(true);
        toast.loading(`Uploading ${files.length} resume${files.length > 1 ? 's' : ''}...`, {
            id: "upload-resumes"
        });

        try {
            // Upload each resume (EXISTING LOGIC - SAME AS CURRENT)
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("job_id", job._id); // 🔗 Link resume to this specific job
                if (user?.id) {
                    formData.append("user_id", user.id); // Multi-tenancy: Associate with user
                }

                const res = await fetch("http://127.0.0.1:8000/extract-resume", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                return { file: file.name, success: res.ok, db_id: data.db_id };
            });

            await Promise.all(uploadPromises);

            toast.loading("Indexing & Analyzing...", { id: "upload-resumes" });

            // WAIT for Vector Indexing (Atlas can take 2-3s to become searchable)
            await new Promise(resolve => setTimeout(resolve, 3500));

            // Fetch recommendations (EXISTING LOGIC - SAME AS CURRENT)
            const recResponse = await fetch(`http://127.0.0.1:5000/api/recommendations/${job._id}`);

            if (recResponse.ok) {
                const recData = await recResponse.json();
                const matches = recData.data;

                toast.success("Analysis complete!", {
                    description: `Found ${matches.length} matches`,
                    id: "upload-resumes"
                });

                onSuccess(matches);
            } else {
                throw new Error("Failed to fetch recommendations");
            }

        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload resumes", {
                description: "Please ensure backend services are running",
                id: "upload-resumes"
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
                {/* Header */}
                <div className="p-7 border-b border-border/50">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-bold tracking-tight">Upload Resumes</h2>
                            <p className="text-sm text-muted-foreground">
                                for <span className="font-semibold text-foreground">{job.jobTitle}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="size-9 rounded-xl hover:bg-muted/80 transition-all duration-200 flex items-center justify-center group hover:rotate-90"
                            disabled={uploading}
                        >
                            <X className="size-5 group-hover:text-destructive transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-7 space-y-6">
                    {/* Drag & Drop Zone */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />

                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`cursor-pointer relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${isDragging
                            ? "border-primary bg-primary/5 scale-[0.98]"
                            : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
                            }`}
                    >
                        <div className="relative flex flex-col items-center gap-4">
                            <div className={`size-16 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
                                <UploadCloud className="size-8 text-primary" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-lg font-semibold">
                                    {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-sm text-muted-foreground">PDF or .txt files • Max 10MB per file</p>
                            </div>
                        </div>
                    </div>

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">Selected Files</h3>
                                <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-primary/10">{files.length} files</span>
                            </div>
                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3.5 bg-muted/50 rounded-xl group hover:bg-muted transition-all duration-200 animate-in slide-in-from-left-2"
                                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                                    >
                                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                                            <FileText className="size-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                            className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110"
                                            disabled={uploading}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-7 border-t border-border/50 flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={uploading}
                        className="flex-1 px-5 py-3.5 rounded-xl border border-border/80 hover:bg-muted/50 transition-all duration-200 font-medium disabled:opacity-50 hover:-translate-y-0.5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={files.length === 0 || uploading}
                        className="flex-1 bg-primary text-primary-foreground px-5 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                    >
                        <span>{uploading ? "Processing..." : "Upload & Analyze"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
