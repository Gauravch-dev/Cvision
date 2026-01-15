import re

ROLE_OR_DATE_REGEX = re.compile(
    r"(Intern|Engineer|Member|Developer|Researcher|Lead|Manager)|"
    r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)|"
    r"(19|20)\d{2}|Present",
    re.IGNORECASE
)

def is_category_line(text: str) -> bool:
    return ":" in text[:40]   # category labels appear early

def merge_wrapped_lines(lines,
                        vertical_gap=8.0,
                        x_align_threshold=40.0):
    merged = []
    skip = False

    for i in range(len(lines)):
        if skip:
            skip = False
            continue

        cur = lines[i]

        if i + 1 < len(lines):
            nxt = lines[i + 1]

            same_page = cur["page"] == nxt["page"]
            vertically_close = abs(nxt["top"] - cur["bottom"]) <= vertical_gap
            x_aligned = abs(nxt["x0"] - cur["x0"]) <= x_align_threshold

            # --- HARD STOPS ---
            if cur["is_section_header"] or nxt["is_section_header"]:
                merged.append(cur)
                continue
            
            if not cur["text"].strip("• ").strip():
                continue
            
            # 🔧 FIX — section may not exist yet
            if cur.get("section") != nxt.get("section"):
                merged.append(cur)
                continue
            
            if cur["is_bullet"] or nxt["is_bullet"]:
                merged.append(cur)
                continue

            if is_category_line(cur["text"]) or is_category_line(nxt["text"]):
                merged.append(cur)
                continue

            if ROLE_OR_DATE_REGEX.search(cur["text"]) or ROLE_OR_DATE_REGEX.search(nxt["text"]):
                merged.append(cur)
                continue

            # --- TRUE WRAP ---
            if same_page and vertically_close and x_aligned:
                merged.append({
                    **cur,
                    "text": cur["text"] + " " + nxt["text"],
                    "x1": max(cur["x1"], nxt["x1"]),
                    "bottom": nxt["bottom"],
                    "is_bullet": cur["is_bullet"]  # FIX 4 preserved
                })
                skip = True
                continue

        merged.append(cur)

    return merged



