// // "use client";

// // import { useState } from "react";
// // import DashboardLayout from "@/components/dashboard/DashboardLayout";
// // import UploadPanel from "@/components/dashboard/UploadPanel";
// // import ProcessingStatus from "@/components/dashboard/ProcessingStatus";
// // import ResultsList from "@/components/dashboard/ResultsList";
// // import CandidateInsights from "@/components/dashboard/CandidateInsights";
// // import EmptyState from "@/components/dashboard/EmptyState";
// // import JobFormPanel from "@/components/dashboard/JobFormPanel";

// // export interface Candidate {
// //   id: string;
// //   name: string;
// //   score: number;
// //   experience: number;
// //   skills: string[];
// //   breakdown?: {
// //     matchedSkills: string[];
// //     missingSkills: string[];
// //     reasoning: string;
// //   };
// // }

// // export default function DashboardPage() {
// //   const [processing, setProcessing] = useState(false);
// //   const [candidates, setCandidates] = useState<Candidate[]>([]);
// //   const [selected, setSelected] = useState<Candidate | null>(null);

// //   const handleGenerate = async ({
// //   files,
// //   jobTitle,
// //   jobDescription,
// //   skills,
// //   experience,
// //   candidateCount,
// // }: {
// //   files: File[];
// //   jobTitle: string;
// //   jobDescription: string;
// //   skills: string;
// //   experience:string;
// //   candidateCount: number;
// // }) => {

// //     if (!files.length) return;

// //     setProcessing(true);
// //     setCandidates([]);
// //     setSelected(null);

// //     try {
// //       // 🔹 1. Call backend (REAL)
// //       const formData = new FormData();
// //       formData.append("file", files[0]); // single resume for now

// //       const res = await fetch("http://127.0.0.1:8000/extract-resume", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       if (!res.ok) {
// //         throw new Error("Backend failed");
// //       }

// //       await res.json(); // we don't use it yet

// //       // 🔹 2. TEMP: mock candidates AFTER backend success
// //       const mockCandidates: Candidate[] = [
// //         {
// //           id: "1",
// //           name: files[0].name.replace(".pdf", ""),
// //           score: 85,
// //           experience: 3,
// //           skills: ["Resume Parsed", "Backend Connected"],
// //           breakdown: {
// //             matchedSkills: ["Resume Parsed"],
// //             missingSkills: ["Scoring Logic"],
// //             reasoning:
// //               "Backend integration successful. Matching logic will be added later.",
// //           },
// //         },
// //       ];

// //       setCandidates(mockCandidates);
// //     } catch (error) {
// //       console.error(error);
// //     } finally {
// //       setProcessing(false);
// //     }
// //   };

// //   return (
// //     <DashboardLayout>
// //       <UploadPanel onGenerate={handleGenerate} disabled={processing} />

// //       {processing && <ProcessingStatus />}

// //       {!processing && candidates.length === 0 && <EmptyState />}

// //       {!processing && candidates.length > 0 && (
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* LEFT */}
// //           <div className="lg:col-span-2 space-y-4">
// //             <ResultsList
// //               candidates={candidates}
// //               selectedId={selected?.id}
// //               onSelect={setSelected}
// //             />
// //           </div>

// //           {/* RIGHT */}
// //           <div className="lg:col-span-1">
// //             <div className="sticky top-24">
// //               {selected ? (
// //                 <CandidateInsights candidate={selected} />
// //               ) : (
// //                 <div className="border rounded-xl p-6 text-muted-foreground text-sm">
// //                   Select a candidate to view insights
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </DashboardLayout>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import DashboardLayout from "@/components/dashboard/DashboardLayout";
// import UploadPanel from "@/components/dashboard/UploadPanel";
// import ProcessingStatus from "@/components/dashboard/ProcessingStatus";
// import ResultsList from "@/components/dashboard/ResultsList";
// import CandidateInsights from "@/components/dashboard/CandidateInsights";
// import EmptyState from "@/components/dashboard/EmptyState";

// export interface Candidate {
//   id: string;
//   name: string;
//   score: number;
//   experience: number;
//   skills: string[];
//   breakdown?: {
//     matchedSkills: string[];
//     missingSkills: string[];
//     reasoning: string;
//   };
// }

// export default function DashboardPage() {
//   const [processing, setProcessing] = useState(false);
//   const [candidates, setCandidates] = useState<Candidate[]>([]);
//   const [selected, setSelected] = useState<Candidate | null>(null);
//   const [jobRequirementId, setJobRequirementId] = useState<string | null>(null);

//   const handleGenerate = async ({
//     files,
//     jobTitle,
//     jobDescription,
//     skills,
//     experience,
//     candidateCount,
//   }: {
//     files: File[];
//     jobTitle: string;
//     jobDescription: string;
//     skills: string;
//     experience: string;
//     candidateCount: number;
//   }) => {
//     if (!files.length) return;

//     setProcessing(true);
//     setCandidates([]);
//     setSelected(null);

//     try {
//       // 🔹 STEP 1: Save job requirements to MongoDB
//       console.log("💾 Saving job requirements to database...");
      
//       const jobReqResponse = await fetch("http://127.0.0.1:8000/api/job-requirements", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           jobTitle,
//           jobDescription,
//           skills,
//           experience,
//           candidateCount,
//           resumeCount: files.length,
//         }),
//       });

//       if (!jobReqResponse.ok) {
//         throw new Error("Failed to save job requirements");
//       }

//       const jobReqData = await jobReqResponse.json();
//       const savedJobReqId = jobReqData.data._id;
//       setJobRequirementId(savedJobReqId);
      
//       console.log("✅ Job requirements saved with ID:", savedJobReqId);

//       // 🔹 STEP 2: Process resume (your existing logic)
//       console.log("📄 Processing resumes...");
      
//       const formData = new FormData();
//       formData.append("file", files[0]);
//       formData.append("jobRequirementId", savedJobReqId); // Link to job requirement

//       const resumeResponse = await fetch("http://127.0.0.1:8000/extract-resume", {
//         method: "POST",
//         body: formData,
//       });

//       if (!resumeResponse.ok) {
//         throw new Error("Resume processing failed");
//       }

//       await resumeResponse.json();

//       // 🔹 STEP 3: Update job requirement status to "processing"
//       await fetch(`http://127.0.0.1:8000/api/job-requirements/${savedJobReqId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status: "processing",
//         }),
//       });

//       // 🔹 STEP 4: Mock candidates (replace with real data later)
//       const mockCandidates: Candidate[] = [
//         {
//           id: "1",
//           name: files[0].name.replace(".pdf", ""),
//           score: 85,
//           experience: 3,
//           skills: ["Resume Parsed", "Backend Connected", "MongoDB Saved"],
//           breakdown: {
//             matchedSkills: ["Resume Parsed", "MongoDB Integration"],
//             missingSkills: ["Scoring Logic"],
//             reasoning:
//               "Job requirements saved to MongoDB. Resume processed successfully.",
//           },
//         },
//       ];

//       setCandidates(mockCandidates);

//       // 🔹 STEP 5: Update status to "completed"
//       await fetch(`http://127.0.0.1:8000/api/job-requirements/${savedJobReqId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           status: "completed",
//         }),
//       });

//       console.log("✅ Process completed successfully");
      
//     } catch (error) {
//       console.error("❌ Error:", error);
      
//       // Update status to "failed" if job requirement was created
//       if (jobRequirementId) {
//         await fetch(`http://127.0.0.1:8000/api/job-requirements/${jobRequirementId}`, {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             status: "failed",
//           }),
//         });
//       }
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <DashboardLayout>
//       <UploadPanel onGenerate={handleGenerate} disabled={processing} />

//       {processing && <ProcessingStatus />}

//       {!processing && candidates.length === 0 && <EmptyState />}

//       {!processing && candidates.length > 0 && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-4">
//             <ResultsList
//               candidates={candidates}
//               selectedId={selected?.id}
//               onSelect={setSelected}
//             />
//           </div>

//           <div className="lg:col-span-1">
//             <div className="sticky top-24">
//               {selected ? (
//                 <CandidateInsights candidate={selected} />
//               ) : (
//                 <div className="border rounded-xl p-6 text-muted-foreground text-sm">
//                   Select a candidate to view insights
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }

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
      console.log("📄 Processing resumes...");

      // Process each resume
      const processedResumes: Candidate[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing ${i + 1}/${files.length}: ${file.name}`);

        // Create FormData
        const formData = new FormData();
        formData.append("file", file);

        // Call FastAPI resume extractor
        const response = await fetch("http://localhost:8000/extract-resume", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error(`Failed to extract ${file.name}`);
          continue;
        }

        const result = await response.json();
        console.log(`✅ Extracted ${file.name}:`, result.data);

        // Create candidate from extracted data
        processedResumes.push({
          id: `resume-${i}`,
          name: file.name.replace(/\.(pdf|docx?)$/i, ""),
          score: 0,
          experience: 0,
          skills: result.data?.skills || [],
          breakdown: {
            matchedSkills: [],
            missingSkills: [],
            reasoning: "Resume extracted successfully",
          },
        });
      }

      setCandidates(processedResumes);
      console.log("✅ All resumes processed");

    } catch (error) {
      console.error("❌ Error:", error);
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