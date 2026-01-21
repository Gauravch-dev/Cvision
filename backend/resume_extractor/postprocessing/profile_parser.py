# postprocessing/profile_parser.py
import re
import os
import json
# Import unified AI service
from resume_extractor.ai_service import generate_ai_content

# Patterns for regex fallback
EMAIL = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE = re.compile(r"\+?\d[\d\s\-\(\)]{8,}")
URL = re.compile(r"https?://\S+")

def extract_links(lines):
    links = []
    for l in lines:
        links.extend(URL.findall(l))
    return list(dict.fromkeys(links))

def extract_with_ai(lines):
    """
    Uses AI (OpenRouter/OpenAI/Gemini) to intelligently extract Name, Location, and Summary.
    """
    try:
        # Context: Top 20 lines of resume
        header_text = "\n".join(lines[:20])
        
        prompt = f"""
        Extract the following form this resume header text:
        1. Name
        2. Location (City, Country)
        3. Summary (A short 2-3 sentence professional bio/summary based on the text. **ALWAYS** generate a professional summary based on the role/experience, even if no explicit summary section exists).
        
        Resume Header/Context:
        {header_text}
        
        Return ONLY valid JSON in this format:
        {{ "name": "Name Here", "location": "City, Country", "summary": "Professional summary here..." }}
        
        If not found, use null for fields.
        """
        
        response_text = generate_ai_content(prompt)
        if not response_text:
            return None
        
        # Parse JSON from response
        text = response_text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        
        return data # {name, location, summary}
    except Exception as e:
        print(f"[ERROR] AI Extraction Failed: {e}")
        return None

def parse_profile(raw_lines):
    # 1. Try AI Extraction first
    ai_data = extract_with_ai(raw_lines)
    
    # 2. Extract standard fields via Regex (always robust)
    email = next((EMAIL.search(l).group() for l in raw_lines if EMAIL.search(l)), None)
    phone = next((PHONE.search(l).group() for l in raw_lines if PHONE.search(l)), None)
    links = extract_links(raw_lines)

    if ai_data:
        print(f"[INFO] Gemini Extracted: {ai_data.get('name')} | {ai_data.get('location')}")
        return {
            "name": ai_data.get("name"),
            "email": email,
            "phone": phone,
            "location": ai_data.get("location"),
            "links": links,
            # Prefer AI summary, fallback to raw lines if null
            "summary": ai_data.get("summary") or "\n".join(raw_lines)
        }
    
    # 3. Fallback to Regex Heuristic (if API fails or no key)
    # (Simplified fallback for safety)
    return {
        "name": _regex_name_fallback(raw_lines),
        "email": email,
        "phone": phone,
        "location": _regex_location_fallback(raw_lines),
        "links": links,
        "summary": "\n".join(raw_lines)  # Add summary fallback
    }

def _regex_name_fallback(lines):
    if not lines: return None
    first = lines[0].strip()
    if re.match(r"^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$", first):
        return first
    return None

def _regex_location_fallback(lines):
    for l in lines:
        m = re.search(r"(San Francisco|New York|Los Angeles|London|Mumbai|Bangalore|Delhi)", l, re.I)
        if m: return m.group(1)
    return None
