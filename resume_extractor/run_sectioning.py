import json

from sectioning.section_mapper import assign_sections
from sectioning.wrapped_line_merger import (
    merge_lines,
    merge_education_wrapped,
)
from postprocessing.bullet_splitter import split_embedded_bullets
from postprocessing.bullet_merger import merge_bullet_continuations
from postprocessing.section_structurer import structure_resume
from postprocessing.embedded_bullet_extractor import extract_embedded_bullets
from postprocessing.education_parser import split_education_entries
from postprocessing.final_mapper import build_final_resume
from postprocessing.phrase_extractor import extract_phrases




# ---------------------------
# LOAD EXTRACTED LINES
# ---------------------------
with open("output/extracted_lines.json", "r", encoding="utf-8") as f:
    lines = json.load(f)


# ---------------------------
# STAGE 1: SECTION ASSIGNMENT
# ---------------------------
sectioned = assign_sections(lines)

assert all("section" in l for l in sectioned), "Section assignment failed"


# ---------------------------
# STAGE 2: WRAPPED LINE MERGING
# ---------------------------
merged = merge_lines(sectioned)


# ---------------------------
# STAGE 3: EMBEDDED BULLET SPLITTING
# ---------------------------
merged = split_embedded_bullets(merged)


# ---------------------------
# STAGE 4: BULLET CONTINUATION MERGE (ONCE)
# ---------------------------
merged = merge_bullet_continuations(merged)


# ---------------------------
# STAGE 5: EDUCATION-SPECIFIC MERGING
# ---------------------------
merged = merge_education_wrapped(merged)


# ---------------------------
# STAGE 5b: BULLET CONTINUATION MERGE (AGAIN)
#
# Some PDFs place bullets on the same visual line as education/project titles.
# After education merging, we run the continuation pass once more to make sure
# any newly-adjacent bullet fragments are stitched.
# ---------------------------
merged = merge_bullet_continuations(merged)


# ---------------------------
# FINAL SANITY CHECK
# ---------------------------
merged = [
    l for l in merged
    if l.get("text") and l["text"].strip()
]

assert all("text" in l for l in merged), "Corrupted lines detected"


# ---------------------------
# SAVE FLAT, CLEANED OUTPUT
# ---------------------------
with open("output/sectioned_merged_lines.json", "w", encoding="utf-8") as f:
    json.dump(merged, f, indent=2)

print("✅ Sectioning + line normalization complete.")


# =====================================================
# STRUCTURING PHASE (SEMANTIC)
# =====================================================

# ---------------------------
# STAGE 6: STRUCTURE RESUME
# ---------------------------
structured = structure_resume(merged)

structured = extract_phrases(structured)

# ---------------------------
# STAGE 7: EXTRACT EMBEDDED BULLETS (POST-STRUCTURE)
# ---------------------------
structured = extract_embedded_bullets(structured)


# ---------------------------
# STAGE 8: SPLIT EDUCATION ENTRIES
# ---------------------------
structured["education"] = split_education_entries(
    structured.get("education", [])
)


# ---------------------------
# STAGE 9: FINAL NORMALIZATION
# ---------------------------
final_resume = build_final_resume(structured)


# ---------------------------
# SAVE FINAL OUTPUT
# ---------------------------
with open("output/structured_resume.json", "w", encoding="utf-8") as f:
    json.dump(final_resume, f, indent=2)

print("✅ Resume structuring complete.")
