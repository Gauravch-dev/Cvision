from typing import List, Dict
from itertools import groupby

def build_lines(words: List[Dict], y_threshold: float = 3.0) -> List[Dict]:
    """
    Group words into lines using vertical proximity.
    """

    # Sort by page → top → x0
    words.sort(key=lambda w: (w["page"], w["top"], w["x0"]))

    lines = []
    line_id = 0

    for page, page_words in groupby(words, key=lambda w: w["page"]):
        page_words = list(page_words)

        current_line = []
        current_top = None

        for w in page_words:
            if current_top is None:
                current_top = w["top"]
                current_line.append(w)
                continue

            if abs(w["top"] - current_top) <= y_threshold:
                current_line.append(w)
            else:
                lines.append(_finalize_line(current_line, page, line_id))
                line_id += 1
                current_line = [w]
                current_top = w["top"]

        if current_line:
            lines.append(_finalize_line(current_line, page, line_id))
            line_id += 1

    return lines


def _finalize_line(words: List[Dict], page: int, line_id: int) -> Dict:
    words.sort(key=lambda w: w["x0"])
    text = " ".join(w["text"] for w in words)

    return {
        "line_id": f"l{line_id}",
        "page": page,
        "text": text.strip(),
        "x0": min(w["x0"] for w in words),
        "x1": max(w["x1"] for w in words),
        "top": min(w["top"] for w in words),
        "bottom": max(w["bottom"] for w in words)
    }
