# postprocessing/skills_categorizer.py
SKILL_BUCKETS = {
    "languages": ["python", "java", "c++", "javascript"],
    "frameworks": ["react", "spring", "fastapi"],
    "databases": ["mysql", "postgresql", "mongodb"],
    "cloud_devops": ["docker", "kubernetes", "aws"],
    "concepts": ["dsa", "ml", "nlp", "os"]
}

def categorize_skills(raw_skills):
    categorized = {k: [] for k in SKILL_BUCKETS}

    for line in raw_skills:
        lower = line.lower()
        for bucket, keywords in SKILL_BUCKETS.items():
            for kw in keywords:
                if kw in lower:
                    categorized[bucket].append(kw)

    return categorized
