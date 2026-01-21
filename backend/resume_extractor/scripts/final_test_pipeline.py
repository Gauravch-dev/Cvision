# scripts/final_test_pipeline.py
import json
import os
import sys
import uuid
import time
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from recommender.embedder import Embedder
from recommender.jd_views import jd_to_views
from recommender.text_views import resume_to_views
from recommender.matcher import batch_rank_candidates

# -----------------------
# CONFIG
# -----------------------
INPUT_JD_FILE = "jd_backend.json"
INPUT_RESUMES_FILE = "resume_embeddings.jsonl"  # can be a small file
OUTPUT_RESUMES_LARGE = "resumes_large.jsonl"
OUTPUT_RANKED = "ranked_results.json"
DUPLICATE_FACTOR = 200
EMBED_BATCH = 64
TOP_K = 50
DEVICE = "cpu"  # or "cuda"

# -----------------------
# UTILS
# -----------------------
def load_jsonl(path):
    out = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            out.append(json.loads(line))
    return out

def save_jsonl(data, path):
    with open(path, "w", encoding="utf-8") as f:
        for item in data:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

def duplicate_resumes(resumes, factor):
    duplicated = []
    for i in range(factor):
        for r in resumes:
            copy_r = dict(r)
            copy_r["candidate_id"] = str(uuid.uuid4())
            duplicated.append(copy_r)
    return duplicated

# -----------------------
# PIPELINE
# -----------------------
def main():
    pipeline_start = time.time()
    print(f"⏱ Pipeline start: {datetime.now()}")

    # 1️⃣ Load JD
    t0 = time.time()
    with open(INPUT_JD_FILE, "r", encoding="utf-8") as f:
        jd = json.load(f)
    print(f"✅ Loaded JD file in {time.time()-t0:.2f} sec")

    # 2️⃣ Embed JD
    t0 = time.time()
    views = jd_to_views(jd)
    embedder = Embedder(device=DEVICE)
    jd_embeddings = embedder.embed_views(views)
    print(f"✅ Embedded JD in {time.time()-t0:.2f} sec")

    # Keep meta for matcher
    jd_form = {
        "skills": jd.get("skills", []),
        "experience": jd.get("experience", ""),
    }
    jd_embeddings["_skills_text"] = " ".join(jd_form.get("skills", []))

    # 3️⃣ Load resumes
    t0 = time.time()
    resumes = load_jsonl(INPUT_RESUMES_FILE)
    print(f"✅ Loaded {len(resumes)} resumes in {time.time()-t0:.2f} sec")

    # 4️⃣ Duplicate resumes for load testing
    t0 = time.time()
    resumes_large = duplicate_resumes(resumes, DUPLICATE_FACTOR)
    save_jsonl(resumes_large, OUTPUT_RESUMES_LARGE)
    print(f"✅ Duplicated resumes x {DUPLICATE_FACTOR} = {len(resumes_large)} total in {time.time()-t0:.2f} sec")

    # 5️⃣ Embed resumes
    t0 = time.time()
    candidates = []
    for r in resumes_large:
        views_r = resume_to_views(r["resume"] if "resume" in r else r)
        texts = [views_r.get(k, "") for k in ["skills","experience","projects","education","certifications","phrases","full_text"]]
        vecs = embedder.encode_texts(texts, batch_size=EMBED_BATCH)
        embeddings_r = {k: vecs[i].tolist() for i, k in enumerate(["skills","experience","projects","education","certifications","phrases","full_text"])}
        candidates.append({
            "candidate_id": r.get("candidate_id"),
            "views": views_r,
            "embeddings": embeddings_r
        })
    print(f"✅ Embedded {len(candidates)} resumes in {time.time()-t0:.2f} sec")

    # 6️⃣ Rank candidates
    t0 = time.time()
    ranked = batch_rank_candidates(
        jd_form=jd_form,
        jd_embeddings=jd_embeddings,
        candidates=candidates,
        top_k=TOP_K,
    )
    print(f"✅ Ranked top {TOP_K} candidates in {time.time()-t0:.2f} sec")

    # 7️⃣ Save results
    t0 = time.time()
    with open(OUTPUT_RANKED, "w", encoding="utf-8") as f:
        json.dump(ranked, f, indent=2)
    print(f"✅ Saved ranked results in {time.time()-t0:.2f} sec")

    print(f"⏱ Pipeline end: {datetime.now()}")
    print(f"🕒 Total pipeline time: {time.time()-pipeline_start:.2f} sec")

if __name__ == "__main__":
    main()
