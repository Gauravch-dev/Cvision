from postprocessing.education_normalizer import normalize_education
from postprocessing.skills_categorizer import categorize_skills
from postprocessing.profile_parser import parse_profile

def build_final_resume(structured):
    """
    FINAL OUTPUT CONTRACT (v1 – frozen):
    This schema feeds the MATCHING ENGINE.
    """

    final = {
        "profile": parse_profile(
            structured.get("profile", {}).get("raw", [])
        ),
        "education": normalize_education(
            structured.get("education", [])
        ),
        "experience": structured.get("experience", []),
        "projects": structured.get("projects", []),
        "skills": categorize_skills(
            structured.get("skills", {}).get("raw", [])
        ),
        "certifications": structured.get("certifications", []),
        "other": structured.get("other", []),
        "signals": structured.get("signals", {
            "phrases": [],
            "full_text": ""
        })
    }

    return final
