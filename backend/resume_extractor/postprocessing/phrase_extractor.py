import re
from typing import List, Dict, Any

STOPWORDS = {
    "and", "or", "with", "using", "for", "of", "in", "to", "on", "by"
}

PHRASE_SPLIT_RE = re.compile(r"[•|,\n;/()]+")

CAPITAL_PHRASE_RE = re.compile(
    r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4})\b"
)

TECH_LIKE_RE = re.compile(
    r"\b([A-Za-z0-9\+\#\.\-]{2,})\b"
)

def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def _extract_from_text(text: str) -> List[str]:
    phrases = []
    chunks = PHRASE_SPLIT_RE.split(text)

    for chunk in chunks:
        chunk = _normalize(chunk)
        if len(chunk) < 3:
            continue

        # Capitalized domain / role phrases
        for m in CAPITAL_PHRASE_RE.finditer(chunk):
            p = _normalize(m.group(1))
            if len(p.split()) >= 2:
                phrases.append(p)

        # Noun / tech phrase builder
        tokens = chunk.split()
        buf = []

        for t in tokens:
            tl = t.lower()

            if tl in STOPWORDS:
                if len(buf) >= 2:
                    phrases.append(" ".join(buf))
                buf = []
                continue

            if TECH_LIKE_RE.match(t):
                buf.append(t)
            else:
                if len(buf) >= 2:
                    phrases.append(" ".join(buf))
                buf = []

        if len(buf) >= 2:
            phrases.append(" ".join(buf))

    return phrases


def extract_phrases(structured_resume: Dict[str, Any]) -> Dict[str, Any]:
    """
    Adds:
      structured_resume["signals"]["phrases"]
      structured_resume["signals"]["full_text"]

    Designed for MATCHING ENGINE, not UI perfection.
    """

    phrases: List[str] = []
    full_text_parts: List[str] = []

    # ---- Education ----
    for e in structured_resume.get("education", []):
        txt = ""
        if isinstance(e, dict):
            txt = e.get("entry") or e.get("institution") or ""
        else:
            txt = str(e)

        if txt:
            phrases.extend(_extract_from_text(txt))
            full_text_parts.append(txt)

    # ---- Experience ----
    for exp in structured_resume.get("experience", []):
        header = exp.get("header", "")
        if header:
            phrases.extend(_extract_from_text(header))
            full_text_parts.append(header)

        for b in exp.get("bullets", []):
            phrases.extend(_extract_from_text(b))
            full_text_parts.append(b)

    # ---- Projects ----
    for proj in structured_resume.get("projects", []):
        title = proj.get("title", "")
        if title:
            phrases.extend(_extract_from_text(title))
            full_text_parts.append(title)

        for b in proj.get("bullets", []):
            phrases.extend(_extract_from_text(b))
            full_text_parts.append(b)

    # ---- Skills (RAW ON PURPOSE) ----
    for s in structured_resume.get("skills", {}).get("raw", []):
        phrases.extend(_extract_from_text(s))
        full_text_parts.append(s)

    # ---- Certifications ----
    for c in structured_resume.get("certifications", []):
        phrases.extend(_extract_from_text(c))
        full_text_parts.append(c)

    # ---- Other ----
    for o in structured_resume.get("other", []):
        phrases.extend(_extract_from_text(o))
        full_text_parts.append(o)

    # ---- Deduplicate (preserve order) ----
    seen = set()
    deduped_phrases = []
    for p in phrases:
        if p not in seen:
            seen.add(p)
            deduped_phrases.append(p)

    structured_resume["signals"] = {
        "phrases": deduped_phrases,
        "full_text": _normalize(" ".join(full_text_parts))
    }

    return structured_resume
