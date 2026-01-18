import re

SECTION_PATTERNS = {
    "education": re.compile(r"\bEDUCATION\b", re.I),
    "experience": re.compile(r"\bWORK EXPERIENCE\b|\bEXPERIENCE\b", re.I),
    "skills": re.compile(r"\bSKILLS\b", re.I),
    "projects": re.compile(r"\bPROJECTS\b", re.I),
    "certifications": re.compile(r"\bCERTIFICATIONS\b", re.I),
}

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
