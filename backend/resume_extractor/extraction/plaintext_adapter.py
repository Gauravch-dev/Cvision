import re,sys,os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
SECTION_PATTERNS = {
    "education": re.compile(r"\bEDUCATION\b", re.I),
    "experience": re.compile(r"\bWORK EXPERIENCE\b|\bEXPERIENCE\b", re.I),
    "skills": re.compile(r"\bSKILLS\b", re.I),
    "projects": re.compile(r"\bPROJECTS\b", re.I),
    "certifications": re.compile(r"\bCERTIFICATIONS\b", re.I),
}
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

def adapt_plaintext_lines(lines):
    """
    Converts inline plaintext resumes into section-aware lines.
    """
    adapted = []
    current_section = "profile"

    for line in lines:
        text = line["text"]

        matched = False
        for section, pattern in SECTION_PATTERNS.items():
            if pattern.search(text):
                # Split heading from content
                parts = pattern.split(text, maxsplit=1)

                # Insert section header
                adapted.append({
                    **line,
                    "text": section.upper(),
                    "is_section_header": True,
                    "section": section
                })

                # Remaining content goes under that section
                if len(parts) > 1 and parts[1].strip():
                    adapted.append({
                        **line,
                        "text": parts[1].strip(),
                        "is_section_header": False,
                        "section": section
                    })

                current_section = section
                matched = True
                break

        if not matched:
            adapted.append({
                **line,
                "section": current_section
            })

    return adapted
