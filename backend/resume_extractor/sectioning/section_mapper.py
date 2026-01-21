# sectioning/section_mapper.py
from sectioning.header_normalizer import (
    normalize_header,
    normalize_and_split_header,
    looks_like_header,
)

PAGE_MID_X = 300  # adjust if template changes


def assign_sections(lines):
    current_sections = ["profile"]
    output = []

    for line in lines:
        text = line["text"]
        x0 = line.get("x0", 0)

        # HEADER DETECTION (visual OR inferred)
        if looks_like_header(line):
            detected = normalize_and_split_header(text)

            if not detected:
                # detected = ["other"]
                detected = current_sections

            current_sections = detected

            line["is_section_header"] = True
            line["section"] = detected[0]
            output.append(line)
            continue

        # CONTENT ASSIGNMENT
        if len(current_sections) == 1:
            line["section"] = current_sections[0]
        else:
            # Column-aware routing for compound headers
            if x0 < PAGE_MID_X:
                line["section"] = current_sections[0]
            else:
                line["section"] = current_sections[1]

        output.append(line)

    return output
