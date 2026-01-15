import re

BULLET_REGEX = re.compile(r"^\s*[•\-*]\s+")
SECTION_HEADER_REGEX = re.compile(
    r"^(Education|Experience|Projects|Technical Skills|Certifications)",
    re.IGNORECASE
)

def enrich_lines(lines):
    for l in lines:
        l["is_bullet"] = bool(BULLET_REGEX.match(l["text"]))
        l["is_section_header"] = bool(SECTION_HEADER_REGEX.match(l["text"]))
    return lines
