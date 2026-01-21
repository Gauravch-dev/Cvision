# postprocessing/profile_parser.py
import re

EMAIL = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE = re.compile(r"\+?\d[\d\s\-\(\)]{8,}")

URL = re.compile(r"https?://\S+")

def extract_links(lines):
    links = []
    for l in lines:
        links.extend(URL.findall(l))
    return list(dict.fromkeys(links))  # dedupe, preserve order


def extract_name(lines):
    """
    Heuristic:
    - Look only at FIRST line
    - Take first 2–3 capitalized words
    """
    if not lines:
        return None

    first = lines[0]
    tokens = re.findall(r"[A-Z][a-z]+", first)

    if len(tokens) >= 2:
        return " ".join(tokens[:2])

    return None


def extract_location(lines):
    """
    Heuristic:
    - Look for City-like phrases near phone or after job title
    - Allow commas / parentheses
    """
    for l in lines:
        # common city patterns
        m = re.search(r"(San Francisco|New York|Los Angeles|Chicago|London|Mumbai|Delhi|Bangalore|Pune)", l, re.I)
        if m:
            return m.group(1)

        # fallback: Capitalized City Words
        m2 = re.search(r"([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s*\(", l)
        if m2:
            return m2.group(1)

    return None


def parse_profile(raw_lines):
    return {
        "name": extract_name(raw_lines),
        "email": next((EMAIL.search(l).group() for l in raw_lines if EMAIL.search(l)), None),
        "phone": next((PHONE.search(l).group() for l in raw_lines if PHONE.search(l)), None),
        "location": extract_location(raw_lines),
        "links": extract_links(raw_lines)
    }
