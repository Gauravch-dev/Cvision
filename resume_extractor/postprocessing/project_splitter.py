import re
from typing import Dict, List, Tuple

# A project title is usually 2+ capitalized tokens (avoids matching sentences like "Built an ...")
TITLE_RE = r"(?:[A-Z][A-Za-z0-9]+(?:[\-/][A-Za-z0-9]+)?)(?:\s+[A-Z][A-Za-z0-9]+(?:[\-/][A-Za-z0-9]+)?)+"
VERB_RE = r"(?:Built|Developed|Implemented|Designed|Created|Architected|Deployed|Led|Constructed)"

# Matches: "Student Management System Built ..." -> group 'title'
PROJECT_START_REGEX = re.compile(rf"(?:^|\s)(?P<title>{TITLE_RE})\s+{VERB_RE}\b")


def split_compound_project_line(text: str) -> List[str]:
    """Split a single paragraph containing multiple projects into separate chunks.

    If no clear project boundaries are detected, returns [text].
    """
    t = (text or "").strip()
    if not t:
        return []

    matches = list(PROJECT_START_REGEX.finditer(t))
    if len(matches) <= 1:
        return [t]

    chunks: List[str] = []
    for i, m in enumerate(matches):
        start = m.start("title")
        end = matches[i + 1].start("title") if i + 1 < len(matches) else len(t)
        chunk = t[start:end].strip()
        if chunk:
            chunks.append(chunk)
    return chunks


def split_projects(projects: List[Dict]) -> List[Dict]:
    """Normalize projects list.

    Input is expected to be a list of blocks like:
      {"title": "...", "bullets": [...]}

    - If a title paragraph contains multiple projects, split it into multiple blocks.
    - Bullets remain attached to the *first* split chunk (best-effort; safe for matching).
    """
    out: List[Dict] = []
    for p in projects or []:
        title = (p.get("title") or "").strip()
        bullets = p.get("bullets") or []

        if not title:
            continue

        chunks = split_compound_project_line(title)
        if not chunks:
            continue

        if len(chunks) == 1:
            out.append({"title": title, "bullets": bullets})
            continue

        # Multiple projects detected: attach any bullets to the first chunk only
        out.append({"title": chunks[0], "bullets": bullets})
        for c in chunks[1:]:
            out.append({"title": c, "bullets": []})

    return out
