import re
from typing import Any, Dict, List, Optional

# Accept en-dash/em-dash/hyphen in year ranges
YEAR_RANGE_RE = re.compile(r"\b(?:19|20)\d{2}\s*[\-\u2013\u2014]\s*(?:19|20)\d{2}\b")
YEAR_RE = re.compile(r"\b(?:19|20)\d{2}\b")
CGPA_RE = re.compile(r"\b(CGPA|GPA)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\b", re.IGNORECASE)
PERCENT_RE = re.compile(r"\b([0-9]+(?:\.[0-9]+)?)\s*%\b")


def _pick_year_or_range(text: str) -> Optional[str]:
    m = YEAR_RANGE_RE.search(text)
    if m:
        return m.group(0)
    years = YEAR_RE.findall(text)
    if not years:
        return None
    # Prefer the earliest year as start (common in education lines)
    # but if many years exist, keep a compact representation of min-max.
    ys = [int(y) for y in years]
    if len(ys) == 1:
        return str(ys[0])
    return f"{min(ys)}–{max(ys)}"


def _extract_score(text: str) -> Optional[str]:
    m = CGPA_RE.search(text)
    if m:
        return f"{m.group(1).upper()}: {m.group(2)}"
    m = PERCENT_RE.search(text)
    if m:
        return f"{m.group(1)}%"
    return None


CGPA_RE = re.compile(r"(CGPA|GPA)\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)", re.IGNORECASE)
PERCENT_RE = re.compile(r"([0-9]+(?:\.[0-9]+)?)\s*%")

YEAR_RANGE_RE = re.compile(r"(19|20)\d{2}\s*[–-]\s*(19|20)\d{2}")

def normalize_education(education_entries):
    normalized = []

    for e in education_entries:
        raw = e.get("entry", "").strip()
        if not raw:
            continue

        # --- Extract dates ---
        dates_match = YEAR_RANGE_RE.search(raw)
        dates = dates_match.group(0) if dates_match else None

        # --- Extract score (CGPA preferred over %) ---
        cgpa_match = CGPA_RE.search(raw)
        percent_match = PERCENT_RE.search(raw)

        if cgpa_match:
            score = f"CGPA: {cgpa_match.group(2)}"
        elif percent_match:
            score = f"{percent_match.group(1)}%"
        else:
            score = None

        normalized.append({
            "institution": raw,
            "degree": "",
            "field": "",
            "dates": dates,
            "score": score
        })

    return normalized
