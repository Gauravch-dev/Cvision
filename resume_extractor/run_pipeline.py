import json

# -------- EXTRACTION --------
from extraction.pdf_digital import extract_pdf_words
from extraction.line_builder import build_lines
from extraction.regex_flags import enrich_lines
from extraction.merge_lines import merge_wrapped_lines

from input_adapters.plaintext_adapter import plaintext_to_lines

# -------- SECTIONING --------
from sectioning.section_mapper import assign_sections
from sectioning.wrapped_line_merger import merge_lines, merge_education_wrapped

# -------- POSTPROCESSING --------
from postprocessing.bullet_splitter import split_embedded_bullets
from postprocessing.bullet_merger import merge_bullet_continuations
from postprocessing.section_structurer import structure_resume
from postprocessing.embedded_bullet_extractor import extract_embedded_bullets
from postprocessing.education_parser import split_education_entries
from postprocessing.phrase_extractor import extract_phrases
from postprocessing.final_mapper import build_final_resume

from extraction.plaintext_adapter import adapt_plaintext_lines

# ---------------------------
# CONFIG
# ---------------------------
INPUT_TYPE = "pdf"        # "pdf" | "plaintext"
PDF_PATH = "resume6.pdf"
PLAINTEXT_PATH = "plaintext_resume.txt"

DEBUG_DUMP = True         # set False in production


def run_pipeline():
    # ===========================
    # STAGE 0: INPUT
    # ===========================
    if INPUT_TYPE == "pdf":
        words = extract_pdf_words(PDF_PATH)
        lines = build_lines(words)
        lines = enrich_lines(lines)
        lines = merge_wrapped_lines(lines)
    else:
        with open(PLAINTEXT_PATH, "r", encoding="utf-8") as f:
            text = f.read()
        lines = plaintext_to_lines(text)
    
    lines = adapt_plaintext_lines(lines)

    # ===========================
    # STAGE 1: SECTIONING
    # ===========================
    sectioned = assign_sections(lines)

    # ===========================
    # STAGE 2: LINE NORMALIZATION
    # ===========================
    merged = merge_lines(sectioned)
    merged = split_embedded_bullets(merged)
    merged = merge_bullet_continuations(merged)
    merged = merge_education_wrapped(merged)
    merged = merge_bullet_continuations(merged)

    merged = [
        l for l in merged
        if l.get("text") and l["text"].strip()
    ]

    if DEBUG_DUMP:
        with open("output/sectioned_merged_lines.json", "w", encoding="utf-8") as f:
            json.dump(merged, f, indent=2)

    # ===========================
    # STAGE 3: STRUCTURING
    # ===========================
    structured = structure_resume(merged)
    structured = extract_phrases(structured)
    structured = extract_embedded_bullets(structured)

    structured["education"] = split_education_entries(
        structured.get("education", [])
    )

    # ===========================
    # STAGE 4: FINAL NORMALIZATION
    # ===========================
    final_resume = build_final_resume(structured)

    # ===========================
    # OUTPUT
    # ===========================
    with open("output/structured_resume.json", "w", encoding="utf-8") as f:
        json.dump(final_resume, f, indent=2)

    print("✅ Resume parsed successfully")
    return final_resume


if __name__ == "__main__":
    run_pipeline()
