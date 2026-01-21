# postprocessing/embedded_bullet_extractor.py
import re
from typing import List, Dict

BULLET_SPLIT_REGEX = re.compile(r"[•\uf0b7]\s*")

def split_embedded_bullets_in_block(block: Dict, key: str):
    """
    Splits embedded bullets inside header/title field into proper bullets.
    Modifies block in-place.
    """
    text = block.get(key)
    if not text:
        return

    parts = BULLET_SPLIT_REGEX.split(text)

    if len(parts) <= 1:
        return  # nothing to split

    # First part becomes header/title
    block[key] = parts[0].strip()

    # Rest become bullets
    bullets = [p.strip() for p in parts[1:] if p.strip()]
    block.setdefault("bullets", []).extend(bullets)


def extract_embedded_bullets(resume: Dict):
    # Experience
    for exp in resume.get("experience", []):
        split_embedded_bullets_in_block(exp, "header")

    # Projects
    for proj in resume.get("projects", []):
        split_embedded_bullets_in_block(proj, "title")

    return resume
