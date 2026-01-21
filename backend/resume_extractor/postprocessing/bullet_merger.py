# postprocessing/bullet_merger.py
from extraction.merge_lines import ROLE_OR_DATE_REGEX
from extraction.merge_lines import is_category_line

import re

MAX_VERTICAL_GAP = 15
MAX_INDENT_DIFF = 30

DATE_PATTERN = re.compile(
    r"\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|\d{4})\b",
    re.I
)

def looks_like_continuation_text(text: str) -> bool:
    text = text.strip()

    if not text:
        return False

    # lowercase start → very strong continuation signal
    if text[0].islower():
        return True

    # avoid dates / role headers
    if DATE_PATTERN.search(text):
        return False

    # avoid ALL CAPS headers
    if text.isupper() and len(text) < 40:
        return False

    return True


def should_merge(prev, curr) -> bool:
    if not prev.get("is_bullet"):
        return False

    if curr.get("is_section_header"):
        return False

    if curr.get("is_bullet"):
        return False

    if prev.get("page") != curr.get("page"):
        return False

    # vertical proximity
    if curr["top"] - prev["bottom"] > MAX_VERTICAL_GAP:
        return False

    # indentation OR text continuation
    indent_close = abs(curr.get("x0", 0) - prev.get("x0", 0)) <= MAX_INDENT_DIFF
    text_continuation = looks_like_continuation_text(curr["text"])

    return indent_close or text_continuation


def merge_bullet_continuations(lines, vertical_gap=10.0):
    merged = []
    skip = False

    for i in range(len(lines)):
        if skip:
            skip = False
            continue

        cur = lines[i]

        if not cur["is_bullet"]:
            merged.append(cur)
            continue

        text = cur["text"]

        j = i + 1
        while j < len(lines):
            nxt = lines[j]

            # --- HARD STOPS ---
            if nxt["is_section_header"]:
                break

            if nxt["is_bullet"]:
                break

            if cur["section"] != nxt["section"]:
                break

            if ROLE_OR_DATE_REGEX.search(nxt["text"]):
                break

            if is_category_line(nxt["text"]):
                break

            if "•" in nxt["text"]:
                break

            vertically_close = abs(nxt["top"] - cur["bottom"]) <= vertical_gap
            if not vertically_close:
                break

            # merge continuation
            text += " " + nxt["text"]
            cur["bottom"] = nxt["bottom"]
            j += 1
            skip = True

        merged.append({**cur, "text": text})

    return merged
