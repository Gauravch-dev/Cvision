# recommender/text_views.py
from __future__ import annotations
from typing import Dict, Any, List
import re

WS_RE = re.compile(r"\s+")


def _norm(s: str) -> str:
    return WS_RE.sub(" ", (s or "").strip())


def _join(parts: List[str]) -> str:
    parts = [_norm(p) for p in parts if _norm(p)]
    return " ".join(parts).strip()


def resume_to_views(resume: Dict[str, Any]) -> Dict[str, str]:
    """
    Input: final structured resume (your schema v1):
      profile, education, experience, projects, skills, certifications, other, signals{phrases, full_text}
    Output: multiple text views for embedding
    """

    # ---- Skills view ----
    skills = resume.get("skills", {}) or {}
    # your categorized skills: languages/frameworks/databases/cloud_devops/concepts
    skills_parts = []
    for k in ["languages", "frameworks", "databases", "cloud_devops", "concepts", "ai_detected"]:
        vals = skills.get(k, []) or []
        if vals:
            skills_parts.append(f"{k}: " + ", ".join([str(v) for v in vals]))
    skills_text = _join(skills_parts)

    # ---- Experience view ----
    exp_parts = []
    for exp in resume.get("experience", []) or []:
        exp_parts.append(_norm(exp.get("header", "")))
        for b in exp.get("bullets", []) or []:
            exp_parts.append(_norm(b))
    experience_text = _join(exp_parts)

    # ---- Projects view ----
    proj_parts = []
    for p in resume.get("projects", []) or []:
        proj_parts.append(_norm(p.get("title", "")))
        for b in p.get("bullets", []) or []:
            proj_parts.append(_norm(b))
    projects_text = _join(proj_parts)

    # ---- Education view ----
    edu_parts = []
    for e in resume.get("education", []) or []:
        if isinstance(e, dict):
            edu_parts.append(_norm(e.get("institution", "") or e.get("entry", "")))
            # if you have normalized degree/field/score/dates:
            for kk in ["degree", "field", "dates", "score"]:
                if e.get(kk):
                    edu_parts.append(_norm(str(e.get(kk))))
        else:
            edu_parts.append(_norm(str(e)))
    education_text = _join(edu_parts)

    # ---- Certifications view ----
    cert_text = _join([str(c) for c in (resume.get("certifications", []) or [])])

    # ---- Signals ----
    signals = resume.get("signals", {}) or {}
    phrases_text = _join([str(p) for p in (signals.get("phrases", []) or [])])
    full_text = _norm(signals.get("full_text", ""))

    # ---- Fallback full ----
    # If full_text missing, synthesize from everything
    if not full_text:
        full_text = _join([skills_text, experience_text, projects_text, education_text, cert_text])

    return {
        "skills": skills_text,
        "experience": experience_text,
        "projects": projects_text,
        "education": education_text,
        "certifications": cert_text,
        "phrases": phrases_text,
        "full_text": full_text,
    }


def jd_form_to_views(jd: Dict[str, Any]) -> Dict[str, str]:
    """
    JD is best provided as a form JSON. Example recommended schema:

    {
      "title": "Backend Developer",
      "must_have_skills": ["python", "fastapi", "mongodb"],
      "nice_to_have_skills": ["docker", "kubernetes"],
      "min_experience_years": 1,
      "education": "B.Tech / BE CS/IT or equivalent",
      "responsibilities": ["Build APIs", "Work on databases"],
      "keywords": ["REST", "scalable", "microservices"]
    }

    If you pass only a plain JD text, put it into {"full_text": "..."} and it still works.
    """

    title = _norm(jd.get("title", ""))
    must = jd.get("must_have_skills", []) or []
    nice = jd.get("nice_to_have_skills", []) or []
    resp = jd.get("responsibilities", []) or []
    kw = jd.get("keywords", []) or []
    edu = _norm(jd.get("education", ""))
    miny = jd.get("min_experience_years", None)

    full = jd.get("full_text", "")
    if not full:
        full = _join([
            f"Title: {title}" if title else "",
            "Must have: " + ", ".join(must) if must else "",
            "Nice to have: " + ", ".join(nice) if nice else "",
            f"Min experience: {miny} years" if miny is not None else "",
            f"Education: {edu}" if edu else "",
            "Responsibilities: " + " ".join(resp) if resp else "",
            "Keywords: " + ", ".join(kw) if kw else "",
        ])
    else:
        full = _norm(full)

    # Views: keep them focused to reduce noise
    skills_text = _join([
        "Must have: " + ", ".join(must) if must else "",
        "Nice to have: " + ", ".join(nice) if nice else "",
        "Keywords: " + ", ".join(kw) if kw else "",
    ])

    exp_text = _join([
        "Responsibilities: " + " ".join(resp) if resp else "",
        f"Min experience: {miny} years" if miny is not None else "",
    ])

    edu_text = _norm(edu)

    return {
        "skills": skills_text,
        "experience": exp_text,
        "education": edu_text,
        "projects": "",        # JD rarely has projects; leave empty
        "certifications": "",  # optional later
        "phrases": skills_text,
        "full_text": full,
    }
