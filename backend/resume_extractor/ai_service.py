import os
import json
import google.generativeai as genai

# Try to import openai, handle missing dependency
try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("[WARN] 'openai' package not found. OpenRouter/OpenAI fallback will not work. Run 'pip install openai'")

def get_ai_client():
    """
    Determines which AI provider to use based on env vars.
    Priority: OpenRouter > OpenAI > Gemini
    """
    openrouter_key = os.getenv("OPENROUTER_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")

    if openrouter_key and OPENAI_AVAILABLE:
        print("[INFO] Using OpenRouter AI Provider")
        return {
            "type": "openrouter",
            "client": OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=openrouter_key,
            ),
            "model": "google/gemini-2.0-flash-001" # Or 'openai/gpt-4o-mini', customizable
        }
    
    if openai_key and OPENAI_AVAILABLE:
        print("[INFO] Using OpenAI Provider")
        return {
            "type": "openai",
            "client": OpenAI(api_key=openai_key),
            "model": "gpt-4o"
        }

    if gemini_key:
        print("[INFO] Using Google Gemini Provider")
        genai.configure(api_key=gemini_key)
        return {
            "type": "gemini",
            "client": genai,
            "model": "gemini-2.0-flash"
        }

    return None

def generate_ai_content(prompt: str) -> str:
    """
    Unified interface to generate text from any provider.
    Returns the raw string content (candidate for JSON parsing).
    """
    provider = get_ai_client()
    
    if not provider:
        print("[ERROR] No AI API keys found (OpenRouter, OpenAI, or Gemini).")
        return None

    try:
        p_type = provider["type"]
        client = provider["client"]
        model_name = provider["model"]

        if p_type in ["openrouter", "openai"]:
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that extracts structured data from resumes."},
                    {"role": "user", "content": prompt}
                ]
            )
            # Standard OpenAI response structure
            content = response.choices[0].message.content
            return content

        elif p_type == "gemini":
            # Gemini Native
            model = client.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text

    except Exception as e:
        print(f"[ERROR] AI Generation Failed ({p_type}): {e}")
        return None
