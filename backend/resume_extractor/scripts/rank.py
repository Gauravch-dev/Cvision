import json
import os
import sys
import time
import uuid
from typing import List, Dict, Any

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from recommender.matcher import batch_rank_candidates, MatchConfig

# -----------------------
# LOAD JD EMBEDDINGS (PRECOMPUTED)
# -----------------------
with open("jd_embeddings.json", "r", encoding="utf-8") as f:
    jd_data = json.load(f)

jd_embeddings = jd_data["embeddings"]

# jd_form used for explanations and penalties
jd_form = {
    "skills": jd_data["_meta"].get("skills", []),
    "experience": jd_data["_meta"].get("experience", ""),
    "must_have_skills": jd_data["_meta"].get("must_have_skills", []),
}

# required for lexical matcher
jd_embeddings["_skills_text"] = " ".join(jd_form.get("skills", []))

# -----------------------
# LOAD ALL RESUME EMBEDDINGS (safe candidate_id)
# -----------------------
candidates: List[Dict[str, Any]] = []

with open("resume_embeddings.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        r = json.loads(line)
        candidate_id = r.get("candidate_id") or str(uuid.uuid4())  # fallback
        candidates.append({
            "candidate_id": candidate_id,
            "embeddings": r["embeddings"],
            "views": r["views"],
        })

print(f"⏱ Script start: {time.strftime('%Y-%m-%d %H:%M:%S')}")
start_total = time.time()
print(f"✅ Loaded {len(candidates)} candidates")

# -----------------------
# BATCH RANKING
# -----------------------
batch_size = 100  # adjust as needed
all_ranked: List[Dict[str, Any]] = []

for i in range(0, len(candidates), batch_size):
    batch_start = time.time()
    batch = candidates[i:i + batch_size]

    ranked = batch_rank_candidates(
        jd_form=jd_form,
        jd_embeddings=jd_embeddings,
        candidates=batch,
        top_k=len(batch),  # rank all in batch
        cfg=MatchConfig(),
    )
    all_ranked.extend(ranked)
    batch_end = time.time()
    print(f"✅ Ranked resumes {i + 1}-{i + len(batch)} in {batch_end - batch_start:.2f} sec")

# -----------------------
# SORT & GET TOP K
# -----------------------
top_k = 50
all_ranked.sort(key=lambda x: x["match_score"], reverse=True)
final_top = all_ranked[:top_k]

# -----------------------
# SAVE OUTPUT
# -----------------------
with open("ranked_results.json", "w", encoding="utf-8") as f:
    json.dump(final_top, f, indent=2)

end_total = time.time()
print(f"✅ Ranking + match scores saved")
print(f"⏱ Script end: {time.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"🕒 Total execution time: {end_total - start_total:.2f} sec")
