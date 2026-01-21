from __future__ import annotations

import os
import json
import time
import uuid
from typing import List, Dict, Any
from datetime import datetime

# ---------------- PATH SETUP ----------------
import sys
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# ---------------- EXTRACTION ----------------
from extraction.pdf_digital import extract_pdf_words
from extraction.line_builder import build_lines
from extraction.regex_flags import enrich_lines
from extraction.merge_lines import merge_wrapped_lines
from extraction.plaintext_adapter import plaintext_to_lines, adapt_plaintext_lines

# ---------------- SECTIONING ----------------
from sectioning.section_mapper import assign_sections
from sectioning.wrapped_line_merger import merge_lines, merge_education_wrapped

# ---------------- POSTPROCESSING ----------------
from postprocessing.bullet_splitter import split_embedded_bullets
from postprocessing.bullet_merger import merge_bullet_continuations
from postprocessing.section_structurer import structure_resume
from postprocessing.embedded_bullet_extractor import extract_embedded_bullets
from postprocessing.education_parser import split_education_entries
from postprocessing.phrase_extractor import extract_phrases
from postprocessing.final_mapper import build_final_resume

# ---------------- EMBEDDING & MATCHING ----------------
from recommender.embedder import Embedder
from recommender.text_views import resume_to_views
from recommender.matcher import batch_rank_candidates, MatchConfig

VIEW_KEYS = [
    "skills", "experience", "projects",
    "education", "certifications",
    "phrases", "full_text"
]

# =====================================================
# RESUME EXTRACTION
# =====================================================
def extract_resume(path: str) -> Dict[str, Any]:
    if path.lower().endswith(".pdf"):
        words = extract_pdf_words(path)
        lines = build_lines(words)
        lines = enrich_lines(lines)
        lines = merge_wrapped_lines(lines)
    else:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        lines = plaintext_to_lines(text)

    lines = adapt_plaintext_lines(lines)
    sectioned = assign_sections(lines)

    merged = merge_lines(sectioned)
    merged = split_embedded_bullets(merged)
    merged = merge_bullet_continuations(merged)
    merged = merge_education_wrapped(merged)
    merged = merge_bullet_continuations(merged)
    merged = [l for l in merged if l.get("text") and l["text"].strip()]

    structured = structure_resume(merged)
    structured = extract_phrases(structured)
    structured = extract_embedded_bullets(structured)
    structured["education"] = split_education_entries(structured.get("education", []))

    return build_final_resume(structured)

# =====================================================
# LOAD RESUME PATHS
# =====================================================
def load_resume_paths(input_path: str) -> List[str]:
    if os.path.isdir(input_path):
        return [
            os.path.join(input_path, f)
            for f in os.listdir(input_path)
            if f.lower().endswith((".pdf", ".txt"))
        ]
    return [input_path]

# =====================================================
# MAIN PIPELINE
# =====================================================
def main():
    INPUT_PATH = "resumes"                 # folder or single file
    JD_EMBED_FILE = "jd_embeddings.json"
    OUTPUT_FILE = "ranked_results.json"
    DEVICE = "cpu"
    TOP_K = 50

    print(f"\n🚀 Pipeline started: {datetime.now()}")
    t0 = time.time()

    # -------- Load JD --------
    with open(JD_EMBED_FILE, "r", encoding="utf-8") as f:
        jd_data = json.load(f)

    jd_embeddings = jd_data["embeddings"]
    jd_form = {
        "skills": jd_data["_meta"].get("skills", []),
        "experience": jd_data["_meta"].get("experience", ""),
    }
    jd_embeddings["_skills_text"] = " ".join(jd_form["skills"])
    print("✅ JD loaded & cached")

    # -------- Load resumes --------
    resume_paths = load_resume_paths(INPUT_PATH)
    print(f"📄 Found {len(resume_paths)} resumes")

    embedder = Embedder(device=DEVICE)
    candidates = []

    for path in resume_paths:
        resume_file = os.path.basename(path)

        print(f"🔍 Processing: {resume_file}")
        resume = extract_resume(path)
        views = resume_to_views(resume)

        texts = [views.get(k, "") for k in VIEW_KEYS]
        vecs = embedder.encode_texts(texts, batch_size=len(texts))

        embeddings = {k: vecs[i].tolist() for i, k in enumerate(VIEW_KEYS)}

        candidates.append({
            "candidate_id": str(uuid.uuid4()),
            "resume_file": resume_file,   # ✅ THIS IS WHAT HR / WEB USES
            "resume_path": path,          # optional (backend only)
            "views": views,
            "embeddings": embeddings,
        })

    print(f"🧠 Embedded {len(candidates)} resumes")

    # -------- Ranking --------
    ranked = batch_rank_candidates(
        jd_form=jd_form,
        jd_embeddings=jd_embeddings,
        candidates=candidates,
        cfg=MatchConfig(),
        top_k=TOP_K,
    )

    # -------- Save output --------
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(ranked, f, indent=2)

    print(f"🏁 Ranking complete")
    print(f"📁 Output saved to {OUTPUT_FILE}")
    print(f"⏱ Total time: {time.time() - t0:.2f}s\n")

# =====================================================
if __name__ == "__main__":
    main()
