import json
from sectioning.section_mapper import assign_sections
from sectioning.wrapped_line_merger import merge_lines,split_education_blocks,merge_education_wrapped
from postprocessing.bullet_merger import merge_bullet_continuations
from postprocessing.bullet_splitter import split_embedded_bullets


with open("output/extracted_lines.json", "r", encoding="utf-8") as f:
    lines = json.load(f)

# after section assignment
sectioned = assign_sections(lines)

merged = merge_lines(sectioned)

merged = split_embedded_bullets(merged)

merged = merge_bullet_continuations(merged)

merged = merge_education_wrapped(merged)

final_merge = merge_bullet_continuations(merged)

with open("output/sectioned_merged_lines.json", "w", encoding="utf-8") as f:
    json.dump(final_merge, f, indent=2)

print("Sectioning + wrapped-line merging complete.")
