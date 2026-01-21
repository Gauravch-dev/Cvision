"use client";

import { useState } from "react";
import { groupResumeLines } from "@/utils/groupResume";
import ResumeView from "./ResumeView";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/extract-resume", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (json.db_id) {
      console.log("Resume saved to DB with ID:", json.db_id);
    }
    const grouped = groupResumeLines(json.data);

    setResumeData(grouped);
    setLoading(false);
  }

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Extracting..." : "Upload Resume"}
      </button>

      <br /><br />

      {resumeData && <ResumeView data={resumeData} />}
    </div>
  );
}
