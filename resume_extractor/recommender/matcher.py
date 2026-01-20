# recommender/matcher.py
from dataclasses import dataclass, field
from typing import Dict, Any, List
import numpy as np
import re
import math

TOKEN_RE = re.compile(r"[a-z0-9\+\#\.\-]{2,}", re.I)

# -----------------------
# UTILS
# -----------------------
def cosine(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b))

def tokenize(text: str) -> set:
    return set(t.lower() for t in TOKEN_RE.findall(text or ""))

def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)

def valid_text(text: str, min_tokens: int = 6) -> bool:
    return bool(text and len(text.split()) >= min_tokens)

def score_to_percentage(raw_score: float) -> int:
    """
    Locked human-friendly score mapping.
    """
    adjusted = 1 / (1 + math.exp(-6 * (raw_score - 0.15)))
    return int(round(adjusted * 100))


# -----------------------
# WEIGHTS (LOCKED)
# -----------------------
@dataclass
class MatcherWeights:
    phrases: float = 0.45
    full_text: float = 0.35
    skills: float = 0.10
    experience: float = 0.05
    education: float = 0.03
    certifications: float = 0.02


@dataclass
class MatchConfig:
    weights: MatcherWeights = field(default_factory=MatcherWeights)
    required_skill_penalty: float = 0.25
    lexical_boost: float = 0.15


# -----------------------
# EXPLANATION ENGINE
# -----------------------
def build_explanation(jd_form: Dict[str, Any], resume_views: Dict[str, str]) -> str:
    jd_text = " ".join([
        jd_form.get("jobTitle", ""),
        jd_form.get("jobDescription", ""),
        " ".join(jd_form.get("skills", []))
    ]).lower()

    resume_text = (resume_views.get("full_text") or "").lower()

    jd_tokens = list(tokenize(jd_text))
    matched = [t for t in jd_tokens if t in resume_text]

    if not matched:
        return "Matched based on overall profile similarity."

    return f"Matched due to relevance in {', '.join(matched[:5])}."


# -----------------------
# CORE SCORING
# -----------------------
def score_pair(
    resume_embeddings: Dict[str, Any],
    jd_embeddings: Dict[str, Any],
    resume_views: Dict[str, str],
    jd_form: Dict[str, Any],
    cfg: MatchConfig,
) -> Dict[str, Any]:

    w = cfg.weights
    sims = {}
    total = 0.0
    total_w = 0.0

    priority_fields = [
        ("phrases", w.phrases),
        ("full_text", w.full_text),
        ("skills", w.skills),
        ("experience", w.experience),
        ("education", w.education),
        ("certifications", w.certifications),
    ]

    for key, weight in priority_fields:
        if weight <= 0:
            continue

        rv = resume_embeddings.get(key)
        jv = jd_embeddings.get(key)

        if rv is None or jv is None:
            sims[key] = None
            continue

        if not valid_text(resume_views.get(key, "")):
            sims[key] = None
            continue

        s = cosine(np.array(rv), np.array(jv))
        sims[key] = s

        total += weight * s
        total_w += weight

    semantic = total / total_w if total_w else 0.0

    # -----------------------
    # LEXICAL BOOST (PHRASES)
    # -----------------------
    lex = jaccard(
        tokenize(jd_embeddings.get("_skills_text", "")),
        tokenize(resume_views.get("phrases", "")),
    )
    lexical_component = cfg.lexical_boost * lex

    # -----------------------
    # MUST-HAVE PENALTY
    # -----------------------
    missing = []
    resume_text = (resume_views.get("full_text") or "").lower()

    for sk in jd_form.get("skills", []):
        if sk.lower() not in resume_text:
            missing.append(sk.lower())

    penalty = 0.0
    if jd_form.get("skills"):
        penalty = cfg.required_skill_penalty * (len(missing) / len(jd_form["skills"]))

    raw_score = semantic + lexical_component - penalty

    return {
        "raw_score": raw_score,
        "match_score": score_to_percentage(raw_score),
        "explanation": build_explanation(jd_form, resume_views),
        "breakdown": {
            "semantic": semantic,
            "lexical_overlap": lex,
            "lexical_component": lexical_component,
            "penalty": penalty,
            "missing_must_have": missing,
            "similarities": sims,
        }
    }


# -----------------------
# RANKING
# -----------------------
def batch_rank_candidates(
    jd_form: Dict[str, Any],
    jd_embeddings: Dict[str, Any],
    candidates: List[Dict[str, Any]],
    cfg: MatchConfig = MatchConfig(),
    top_k: int = 50,
) -> List[Dict[str, Any]]:

    results = []

    # 🔥 JD embedded ONCE
    jd_phrase_vec = np.array(jd_embeddings["phrases"])
    jd_full_vec = np.array(jd_embeddings["full_text"])

    for c in candidates:
        # We still call score_pair,
        # but embeddings are already cached
        scored = score_pair(
            resume_embeddings=c["embeddings"],
            jd_embeddings=jd_embeddings,
            resume_views=c["views"],
            jd_form=jd_form,
            cfg=cfg,
        )

        results.append({
            "candidate_id": c["candidate_id"],
            "resume_file": c.get("resume_file"),
            "resume_path": c.get("resume_path"),
            **scored
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:top_k]
