"""Education parsing utilities.

We keep this module *lossless*.

Education text frequently appears as a single merged line, e.g.:

  "A University 2020–2024 B.Tech CGPA: 9.1 B College 2018–2020 Diploma 91%"

If we can't confidently split that blob, we return it as a single entry rather
than returning an empty list (which would drop education completely).
"""

from __future__ import annotations

import re
from typing import Any, Dict, List


# Covers:
# - "2020–2024", "2020-2024"
# - "2020–Present"
YEAR_RANGE_REGEX = re.compile(
    r"(?<!\d)(\d{4})\s*[\u2013\-]\s*(\d{4}|Present)(?!\d)",
    re.IGNORECASE,
)

# Covers:
# - "Sept 2023 – June 2027"
# - "Jun 2023 - Present"
MONTH = r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)"
MONTH_YEAR_RANGE_REGEX = re.compile(
    rf"(?i)\b({MONTH})\s+\d{{4}}\s*[\u2013\-]\s*({MONTH}\s+\d{{4}}|Present)\b"
)

SCORE_REGEX = re.compile(
    r"\b(CGPA|GPA)\s*[:]?\s*([0-9]+(?:\.[0-9]+)?)\b|\b([0-9]+(?:\.[0-9]+)?)\s*%\b",
    re.IGNORECASE,
)


def _extract_score(text: str) -> str | None:
    m = SCORE_REGEX.search(text)
    if not m:
        return None
    if m.group(1) and m.group(2):
        # CGPA: 9.63
        return f"{m.group(1).upper()}: {m.group(2)}"
    if m.group(3):
        # 93.26%
        return f"{m.group(3)}%"
    return None


def _split_on_date_ranges(text: str) -> List[str]:
    """Split a long blob into chunks at date-range boundaries.

    We try multiple regexes; if none match, we return [text].
    """
    s = " ".join(text.split())

    # Month-year ranges exist, but reliably splitting multi-entry education based
    # on them tends to be error-prone (formats vary a lot and the date may appear
    # at the end). For robustness we keep the blob as a single entry.
    if MONTH_YEAR_RANGE_REGEX.search(s):
        return [s]

    if YEAR_RANGE_REGEX.search(s):
        # Use a non-capturing split to avoid losing tokens.
        # We split *after* a date-range so each chunk tends to contain exactly
        # one education entry.
        boundary = re.compile(r"(?i)(?:(?<!\d)\d{4}\s*[\u2013\-]\s*(?:\d{4}|Present)(?!\d))")
        spans = list(boundary.finditer(s))
        if not spans:
            return [s]

        chunks: List[str] = []
        last = 0
        for m in spans:
            end = m.end()
            chunk = s[last:end].strip()
            if chunk:
                chunks.append(chunk)
            last = end
        tail = s[last:].strip()
        if tail:
            # tail might be the start of the next entry, so keep it.
            chunks.append(tail)
        return chunks or [s]

    return [s]

YEAR_RANGE_RE = re.compile(r"(19|20)\d{2}\s*[–-]\s*(19|20)\d{2}")

def split_education_entries(entries):
    """
    Split education ONLY on new institution boundaries.
    Never split on CGPA / % / degree lines.
    """
    results = []
    buffer = ""

    for e in entries:
        text = e["entry"].strip()
        if not text:
            continue

        # If this line starts a NEW institution (year range present)
        if YEAR_RANGE_RE.search(text) and buffer:
            results.append({"entry": buffer.strip()})
            buffer = text
        else:
            buffer = f"{buffer} {text}".strip()

    if buffer:
        results.append({"entry": buffer.strip()})

    return results

