import os
import json
# Import unified AI service
# Adjust import path based on file structure: 
# c:\Users\Hp\OneDrive\Desktop\NIT_Bhopal\CVision\Cvision\backend\resume_extractor\postprocessing\skills_categorizer.py
# parent -> postprocessing, parent->parent -> resume_extractor. 
# So it's from resume_extractor.ai_service
from resume_extractor.ai_service import generate_ai_content

SKILL_BUCKETS = {
    "languages": ["python", "java", "c++", "javascript"],
    "frameworks": ["react", "spring", "fastapi"],
    "databases": ["mysql", "postgresql", "mongodb"],
    "cloud_devops": ["docker", "kubernetes", "aws"],
    "concepts": ["dsa", "ml", "nlp", "os"]
}

def extract_skills_with_ai(text):
    """
    Fallback: Use AI (OpenRouter/OpenAI/Gemini) to extract skills.
    """
    # Limit text to save tokens
    truncated_text = text[:3000]
    
    prompt = f"""
    Extract a list of professional skills from this resume text.
    Focus on technical, management, soft skills, and tools.
    
    Resume Text:
    {truncated_text}
    
    Return ONLY a JSON array of strings. Example: ["Skill1", "Skill2"]
    """
    
    try:
        response_text = generate_ai_content(prompt)
        if not response_text:
            return []

        # Clean markdown if present
        clean_text = response_text.replace("```json", "").replace("```", "").strip()
        skills_list = json.loads(clean_text)
        
        if isinstance(skills_list, list):
            return [s for s in skills_list if isinstance(s, str)]
        return []
        
    except Exception as e:
        print(f"[ERROR] AI Skills Extraction Failed: {e}")
        return []

def categorize_skills(raw_skills):
    categorized = {k: [] for k in SKILL_BUCKETS}
    
    # 1. Keyword Matching (Fast, Fixed Taxonomy)
    for line in raw_skills:
        lower = line.lower()
        for bucket, keywords in SKILL_BUCKETS.items():
            for kw in keywords:
                if kw in lower:
                    categorized[bucket].append(kw)
    
    # 2. Check if we missed skills (e.g. non-tech resume or new terms)
    total_found = sum(len(v) for v in categorized.values())
    
    if total_found < 3: # Threshold for fallback
        print("[INFO] Few skills found via keywords. Attempting AI fallback...")
        # Join all raw lines to form context
        full_text = " ".join(raw_skills)
        ai_skills = extract_skills_with_ai(full_text)
        
        if ai_skills:
            print(f"[INFO] AI found {len(ai_skills)} additional skills.")
            # Add to a 'general' or 'other' bucket, or distribute if we had a smart classifier
            # For now, put them in a new 'detected' key or append to an existing list
            # Since the frontend expects specific keys or just a list...
            # The structure returned here is expected to be a dict of lists.
            # Let's add an 'other' bucket or just return them as a raw list wrapper if needed?
            # 'final_mapper' expects this dict.
            
            # Let's add them to 'concepts' or a new 'other' bucket if valid
            # Or better, just return the list if the caller handles it?
            # Re-reading final_mapper.py: It assigns this result to "skills".
            # The frontend expects pData.skills to be an array or string.
            # If backend returns a dict, frontend array check might fail or need update.
            # Let's see: frontend checks `pData.skills.raw` (added recently) or `pData.skills`.
            
            # Update: We should simply add a "raw" key or "detected" key to this dict
            categorized["ai_detected"] = ai_skills

    return categorized
