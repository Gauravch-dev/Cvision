import re
from typing import List, Dict, Any

from postprocessing.project_splitter import split_compound_project_line

BULLET_CHARS = ["•", "·", "●", "▪", "►", "❖", "\uf0b7", ""]
BULLET_SPLIT_RE = re.compile(r"(?:\s+|^)(?:•|·|●|▪|►|❖|\uf0b7|)\s+")

REAL_SECTIONS = {"education", "experience", "projects", "skills", "certifications"}

def _normalize_text(text: str) -> str:
    for b in BULLET_CHARS:
        text = text.replace(b, "•")
    return re.sub(r"\s+", " ", text).strip()

def _split_embedded_bullets(text: str):
    parts = BULLET_SPLIT_RE.split(text)
    return [p.strip() for p in parts if p.strip()] or [text]

def _is_probable_name(text: str) -> bool:
    if len(text.split()) > 5:
        return False
    letters = re.sub(r"[^A-Za-z ]", "", text)
    return letters.replace(" ", "").isalpha()

def structure_resume(lines: List[Dict[str, Any]]) -> Dict[str, Any]:
    resume = {
        "profile": {"raw": []},
        "education": [],
        "experience": [],
        "projects": [],
        "skills": {"raw": []},
        "certifications": [],
        "other": []
    }

    if not lines:
        return resume

    # ---- SORT FOR READING ORDER ----
    lines = sorted(
        lines,
        key=lambda l: (
            l.get("page", 0),
            float(l.get("top", 1e9)),
            float(l.get("x0", 1e9))
        )
    )

    # ---- FIND FIRST REAL SECTION HEADER ----
    first_section_idx = None
    for i, l in enumerate(lines):
        if l.get("is_section_header") and l.get("section") in REAL_SECTIONS:
            first_section_idx = i
            break

    # ---- PROFILE ----
    if first_section_idx is None:
        for l in lines:
            t = _normalize_text(l.get("text", ""))
            if t:
                resume["profile"]["raw"].append(t)
        return resume

    for l in lines[:first_section_idx]:
        if l.get("is_section_header"):
            continue
        t = _normalize_text(l.get("text", ""))
        if not t:
            continue
        if _is_probable_name(t):
            resume["profile"]["raw"].insert(0, t)
        else:
            resume["profile"]["raw"].append(t)

    # ---- STATE ----
    current_section = None
    current_exp = None
    current_proj = None

    # ---- MAIN PARSING ----
    for l in lines[first_section_idx:]:
        text = _normalize_text(l.get("text", ""))
        if not text:
            continue

        explicit_section = l.get("section")

        # SECTION HEADER
        if l.get("is_section_header"):
            current_section = explicit_section
            current_exp = None
            current_proj = None
            continue

        section = current_section or explicit_section or "other"

        # ✅ EDUCATION (EXPLICIT FALLBACK)
        if explicit_section == "education" or section == "education":
            resume["education"].append({"entry": text})
            continue

        # EXPERIENCE
        if section == "experience":
            if not l.get("is_bullet", False):
                parts = _split_embedded_bullets(text)
                current_exp = {"header": parts[0], "bullets": []}
                resume["experience"].append(current_exp)
                for b in parts[1:]:
                    current_exp["bullets"].append(b)
            else:
                if current_exp is None:
                    current_exp = {"header": "", "bullets": []}
                    resume["experience"].append(current_exp)
                current_exp["bullets"].append(text.lstrip("• "))
            continue

        # PROJECTS
        if section == "projects":
            # If the first projects line is a compound paragraph containing multiple
            # project titles, split it into multiple project blocks. Otherwise,
            # treat the first line as the title and subsequent lines as description.
            if current_proj is None:
                chunks = split_compound_project_line(text)
                if len(chunks) > 1:
                    for ch in chunks:
                        current_proj = {"title": ch, "bullets": []}
                        resume["projects"].append(current_proj)
                else:
                    current_proj = {"title": text, "bullets": []}
                    resume["projects"].append(current_proj)
            else:
                current_proj["bullets"].append(text)
            continue

        # SKILLS
        if section == "skills":
            resume["skills"]["raw"].append(text)
            continue

        # CERTIFICATIONS
        if section == "certifications":
            resume["certifications"].append(text.lstrip("• "))
            continue

        resume["other"].append(text)

    return resume

