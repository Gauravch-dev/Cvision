import json
from extraction.pdf_digital import extract_pdf_words
from extraction.line_builder import build_lines
from extraction.regex_flags import enrich_lines
from extraction.merge_lines import merge_wrapped_lines

PDF_PATH = "resume2.pdf"

def run():
    words = extract_pdf_words(PDF_PATH)
    lines = build_lines(words)
    lines = enrich_lines(lines)
    lines = merge_wrapped_lines(lines)

    with open("output/extracted_lines.json", "w", encoding="utf-8") as f:
        json.dump(lines, f, indent=2, ensure_ascii=False)

    print(f"Extracted {len(lines)} lines")
    # for l in lines[:20]:
    #     print(l["text"])

if __name__ == "__main__":
    run()
