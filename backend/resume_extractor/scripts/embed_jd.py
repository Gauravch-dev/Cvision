import json
import os
import sys
import time
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from recommender.embedder import Embedder
from recommender.jd_views import jd_to_views

INPUT_JD_FILE = "jd_backend.json"
OUTPUT_FILE = "jd_embeddings.json"


def main():
    start_total = time.time()
    print(f"⏱ Start embedding JD: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # -----------------------
    # LOAD JD
    # -----------------------
    start_load = time.time()
    with open(INPUT_JD_FILE, "r", encoding="utf-8") as f:
        jd = json.load(f)
    end_load = time.time()
    print(f"✅ Loaded JD file in {end_load - start_load:.2f} sec")

    # -----------------------
    # CONVERT TO VIEWS
    # -----------------------
    views = jd_to_views(jd)

    # -----------------------
    # EMBED ALL VIEWS AT ONCE
    # -----------------------
    start_embed = time.time()
    device = "cuda" if sys.platform != "win32" else None  # optional: force GPU on Linux/Mac
    embedder = Embedder(device=device)

    views_list = list(views.values())
    vecs = embedder.encode_texts(views_list, batch_size=len(views_list))  # batch all at once

    embeddings = {k: vecs[i].tolist() for i, k in enumerate(views.keys())}
    end_embed = time.time()
    print(f"✅ Embedded JD in {end_embed - start_embed:.2f} sec")

    # -----------------------
    # SAVE OUTPUT
    # -----------------------
    start_save = time.time()
    out = {
        "embeddings": embeddings,
        "_meta": {
            "jobTitle": jd.get("jobTitle"),
            "skills": jd.get("skills", []),
            "experience": jd.get("experience"),
            "views": views,
        }
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    end_save = time.time()
    print(f"✅ JD embeddings saved in {end_save - start_save:.2f} sec")

    end_total = time.time()
    print(f"⏱ Finished JD embedding: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🕒 Total time taken: {end_total - start_total:.2f} sec")


if __name__ == "__main__":
    main()
