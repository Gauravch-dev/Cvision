# sectioning/header_normalizer.py
import re

SECTION_PRIORITY = [
    "experience",
    "projects",
    "skills",
    "education",
    "certifications",
    "volunteering",
    "profile",
    "other",
]

# Canonical section keywords (phrases allowed)
SECTION_KEYWORDS = {
    "profile": [
        "profile",
        "summary",
        "professional summary",
        "about",
        "objective",
        "career objective"
    ],
    "education": [
        "education",
        "academic",
    ],
    "experience": [
        "experience",
        "work experience",
        "employment",
        "relevant experience",
        "internship",
        "internships",
        "training"
    ],
    "projects": [
        "projects",
        "project",
        "academic projects"
    ],
    "skills": [
        "skills",
        "technical skills",
        "skillset",
        "softskills"
    ],
    "certifications": [
        "certifications",
        "certification",
        "achievements",
    ],
    "volunteering": [
        "volunteering",
        "volunteer",
    ],
    "other": [
        "interests",
        "languages",
        "coursework",
        "activities",
    ],
}


def normalize_and_split_header(text: str):
    """
    Detects one or more section names from a header line.

    Examples:
        "EXPERIENCE SKILLS" -> ["experience", "skills"]
        "EXPERIENCE & SKILLS" -> ["experience", "skills"]
        "RELEVANT EXPERIENCE" -> ["experience"]
    """
    t = text.lower()
    t = re.sub(r"[|/&]", " ", t)
    t = re.sub(r"[^a-z\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()

    detected = []

    for section, keywords in SECTION_KEYWORDS.items():
        for kw in keywords:
            if re.search(rf"\b{re.escape(kw)}\b", t):
                detected.append(section)
                break

    # Apply deterministic ordering
    ordered = []
    for sec in SECTION_PRIORITY:
        if sec in detected:
            ordered.append(sec)

    return ordered


def looks_like_header(line: dict) -> bool:
    """
    Conservative visual + textual header detector.
    """
    text = line["text"].strip()

    if line.get("is_section_header"):
        return True

    # ALL CAPS, short, no sentence punctuation
    if (
        text.isupper()
        and len(text) <= 45
        and not re.search(r"[.,:;]", text)
    ):
        return True

    return False


def normalize_header(text: str):
    """
    Map header text → single canonical section name.
    """
    detected = normalize_and_split_header(text)
    return detected[0] if detected else None
