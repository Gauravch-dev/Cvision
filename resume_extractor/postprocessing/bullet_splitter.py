import re
from extraction.merge_lines import is_category_line
def split_embedded_bullets(lines):
    out = []

    for line in lines:
        text = line["text"].strip()

        # No bullet at all
        if "•" not in text:
            out.append(line)
            continue

        # Split on bullet but KEEP content together
        parts = [p.strip() for p in text.split("•") if p.strip()]

        for p in parts:
            out.append({
                **line,
                "text": "• " + p,
                "is_bullet": True
            })

    return out

