# recommender/jd_views.py

from typing import Dict, Any

def jd_to_views(jd: Dict[str, Any]) -> Dict[str, str]:
    """
    Converts DB JD object into text views used by embedder + matcher.
    This function is the ONLY place that knows JD schema.
    """

    skills = jd.get("skills", []) or []

    job_title = jd.get("jobTitle", "")
    job_desc = jd.get("jobDescription", "")
    experience = jd.get("experience", "")

    skills_text = " ".join(skills)

    return {
        # 🔥 Highest signal
        "phrases": skills_text,

        # 🔥 Main semantic signal
        "full_text": " ".join([
            job_title,
            job_desc,
            skills_text,
            experience
        ]),

        # Secondary (kept for compatibility)
        "skills": skills_text,
        "experience": experience,
        "education": "",
        "certifications": ""
    }
