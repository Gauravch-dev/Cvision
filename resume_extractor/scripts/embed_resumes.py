from __future__ import annotations

import json
import os
import argparse
import time
import uuid
from typing import Dict, Any, List
from datetime import datetime

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from recommender.embedder import Embedder
from recommender.text_views import resume_to_views

VIEW_KEYS = [
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
    "phrases",
    "full_text",
]

# --------------------------------------------------
# LOAD RESUMES (JSON / JSONL / FOLDER)
# --------------------------------------------------
def load_resumes(path: str) -> List[Dict[str, Any]]:
    resumes = []

    if os.path.isdir(path):
        for fn in os.listdir(path):
            if fn.lower().endswith(".json"):
                with open(os.path.join(path, fn), "r", encoding="utf-8") as f:
                    resumes.append(json.load(f))
        return resumes

    with open(path, "r", encoding="utf-8") as f:
        first = f.readline().strip()
        f.seek(0)

        # JSONL
        if first.startswith("{") and not first.endswith("]"):
            for line in f:
                line = line.strip()
                if line:
                    resumes.append(json.loads(line))
        else:
            # JSON array or single object
            data = json.load(f)
            resumes = data if isinstance(data, list) else [data]

    return resumes


# --------------------------------------------------
# DUPLICATION (OPTIONAL)
# --------------------------------------------------
def duplicate_resumes(resumes: List[Dict[str, Any]], factor: int) -> List[Dict[str, Any]]:
    if factor <= 1:
        return resumes

    duplicated = []
    for _ in range(factor):
        for r in resumes:
            copy_r = dict(r)
            copy_r["candidate_id"] = str(uuid.uuid4())
            duplicated.append(copy_r)
    return duplicated


# --------------------------------------------------
# MAIN
# --------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="JSON, JSONL, or folder")
    ap.add_argument("--output", required=True, help="Output JSONL embeddings")
    ap.add_argument("--duplicate", type=int, default=1, help="Duplicate factor")
    ap.add_argument("--model", default="sentence-transformers/all-MiniLM-L6-v2")
    ap.add_argument("--batch", type=int, default=64)
    ap.add_argument("--device", type=str, default=None, help="cpu or cuda")
    args = ap.parse_args()

    start_total = time.time()
    print(f"⏱ Start: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # 1️⃣ Load resumes
    resumes = load_resumes(args.input)
    print(f"✅ Loaded {len(resumes)} resumes")

    # 2️⃣ Duplicate (optional)
    resumes = duplicate_resumes(resumes, args.duplicate)
    print(f"✅ After duplication: {len(resumes)} resumes")

    # 3️⃣ Embed
    embedder = Embedder(model_name=args.model, device=args.device)

    with open(args.output, "w", encoding="utf-8") as out_f:
        total = len(resumes)
        for i in range(0, total, args.batch):
            batch_start = time.time()
            batch = resumes[i:i + args.batch]

            texts_per_resume = []
            for r in batch:
                views = resume_to_views(r)
                texts_per_resume.append([views.get(k, "") for k in VIEW_KEYS])

            flat_texts = [t for sub in texts_per_resume for t in sub]
            flat_vecs = embedder.encode_texts(flat_texts, batch_size=args.batch)

            for idx, r in enumerate(batch):
                start = idx * len(VIEW_KEYS)
                end = start + len(VIEW_KEYS)
                vecs = flat_vecs[start:end]

                out_f.write(json.dumps({
                    "candidate_id": r.get("candidate_id") or str(uuid.uuid4()),
                    "resume": r,
                    "views": dict(zip(VIEW_KEYS, texts_per_resume[idx])),
                    "embeddings": {k: vecs[j].tolist() for j, k in enumerate(VIEW_KEYS)},
                }, ensure_ascii=False) + "\n")

            print(
                f"✅ Embedded {i + 1}-{i + len(batch)} "
                f"in {time.time() - batch_start:.2f}s"
            )

    print(f"⏱ Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🕒 Total time: {time.time() - start_total:.2f}s")


if __name__ == "__main__":
    main()
