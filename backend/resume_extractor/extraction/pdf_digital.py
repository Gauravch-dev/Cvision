import pdfplumber
from typing import List, Dict

def extract_pdf_words(pdf_path: str) -> List[Dict]:
    """
    Extract words with coordinates from a digital PDF.
    This is the safest possible digital extraction.
    """

    words = []

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            page_words = page.extract_words(
                use_text_flow=True,
                keep_blank_chars=False,
                x_tolerance=1,
                y_tolerance=2
            )

            for w in page_words:
                words.append({
                    "page": page_num,
                    "text": w["text"],
                    "x0": w["x0"],
                    "x1": w["x1"],
                    "top": w["top"],
                    "bottom": w["bottom"]
                })

    return words
