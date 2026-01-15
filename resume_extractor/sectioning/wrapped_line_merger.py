# sectioning/wrapped_line_merger.py
import re
def should_merge(prev, curr, y_threshold=12):
    """
    Decide whether two lines should be merged.
    """

    # Must be same page and section
    if prev["page"] != curr["page"]:
        return False

    if prev["section"] != curr["section"]:
        return False

    # Never merge headers
    if prev.get("is_section_header") or curr.get("is_section_header"):
        return False

    # Do not merge bullet starts
    if curr.get("is_bullet"):
        return False

    # Vertical proximity check
    vertical_gap = curr["top"] - prev["bottom"]
    if vertical_gap > y_threshold:
        return False

    # Heuristic: previous line should not end cleanly
    if prev["text"].strip().endswith((".", ":", ";")):
        return False

    return True


def merge_lines(lines):
    """
    Merge wrapped lines into single logical lines.
    """
    if not lines:
        return []

    merged = []
    buffer = lines[0].copy()

    for curr in lines[1:]:
        if should_merge(buffer, curr):
            buffer["text"] = buffer["text"].rstrip() + " " + curr["text"].lstrip()
            buffer["x0"] = min(buffer["x0"], curr["x0"])
            buffer["x1"] = max(buffer["x1"], curr["x1"])
            buffer["bottom"] = curr["bottom"]
        else:
            merged.append(buffer)
            buffer = curr.copy()

    merged.append(buffer)
    return merged


EDU_ENTRY_SPLIT = re.compile(
    r"(Bachelor|Diploma|Secondary Education|Class\s+X|Class\s+XII)",
    re.IGNORECASE
)

def split_education_blocks(lines):
    out = []

    for line in lines:
        if line["section"] != "education":
            out.append(line)
            continue

        text = line["text"]
        parts = EDU_ENTRY_SPLIT.split(text)

        if len(parts) == 1:
            out.append(line)
            continue

        rebuilt = []
        for i in range(1, len(parts), 2):
            rebuilt.append(parts[i] + parts[i+1])

        for r in rebuilt:
            out.append({
                **line,
                "text": r.strip()
            })

    return out

def merge_education_wrapped(lines, vertical_gap=10.0, x_align_threshold=40.0):
    out = []
    skip = False

    for i in range(len(lines)):
        if skip:
            skip = False
            continue

        cur = lines[i]

        if i + 1 < len(lines):
            nxt = lines[i + 1]

            if (
                cur["section"] == "education"
                and nxt["section"] == "education"
                and cur["page"] == nxt["page"]
                and abs(nxt["top"] - cur["bottom"]) <= vertical_gap
                and abs(nxt["x0"] - cur["x0"]) <= x_align_threshold
                and not cur["is_section_header"]
                and not nxt["is_section_header"]
            ):
                out.append({
                    **cur,
                    "text": cur["text"] + " " + nxt["text"],
                    "x1": max(cur["x1"], nxt["x1"]),
                    "bottom": nxt["bottom"]
                })
                skip = True
                continue

        out.append(cur)

    return out
