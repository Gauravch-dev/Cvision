# input_adapters/plaintext_adapter.py

def plaintext_to_lines(text: str):
    lines = []

    for i, raw in enumerate(text.splitlines()):
        t = raw.strip()
        if not t:
            continue

        lines.append({
            "line_id": f"pt_{i}",
            "page": 0,
            "text": t,
            "x0": 0,
            "x1": 0,
            "top": i * 10,
            "bottom": i * 10 + 5,
            "is_bullet": t.startswith(("-", "•", "*")),
            "is_section_header": False,
            "section": "other",
        })

    return lines
