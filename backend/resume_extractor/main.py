from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from pymongo import MongoClient, errors
from dotenv import load_dotenv
import uuid
from datetime import datetime

# Import internal modules (assumes these are in python path or sibling dirs)
from resume_extractor.run_pipeline import extract_resume as pipeline_extract
from resume_extractor.recommender.embedder import Embedder
from resume_extractor.recommender.text_views import resume_to_views

# New structure: Cvision/backend/resume_extractor/main.py -> Cvision/backend/.env
# Parent dir of 'resume_extractor' is 'backend', so .env is in parent_dir
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
backend_env_path = os.path.join(parent_dir, ".env")

print(f"[DEBUG] Current Dir: {current_dir}")
print(f"[DEBUG] Parent Dir: {parent_dir}")
print(f"[DEBUG] Looking for .env at: {backend_env_path}")

if os.path.exists(backend_env_path):
    print("[DEBUG] .env file FOUND")
    load_dotenv(backend_env_path)
else:
    print("[DEBUG] .env file NOT FOUND")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Database Setup
MONGO_URI = os.getenv("MONGODB_URI")
client = None
db = None

print(f"[DEBUG] MONGO_URI Loaded? {'Yes' if MONGO_URI else 'No (None)'}")
if MONGO_URI:
    print(f"[DEBUG] MONGO_URI starts with: {MONGO_URI[:15]}...")

def connect_db():
    global client, db
    try:
        if not MONGO_URI:
            print("[WARN] MONGODB_URI not found in environment")
            return None
            
        if client:
            try:
                client.admin.command('ping')
                return db
            except Exception:
                print("[WARN] Existing connection lost, reconnecting...")
        
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("[INFO] MongoDB Connection Successful (Ping)")
        db = client["cvision"]
        return db
    except Exception as e:
        print(f"[ERROR] Failed to connect to MongoDB: {e}")
        client = None
        db = None
        return None

# Try initial connection
connect_db()

# Initialize Embedder (Global load for performance)
print("[INFO] Loading AI Model... this may take a moment")
embedder = Embedder(device="cpu")
print("[INFO] AI Model Loaded")

@app.post("/extract-resume")
async def extract_resume_endpoint(file: UploadFile = File(...)):
    global db
    if db is None:
        print("[INFO] Database handle missing, attempting to reconnect...")
        connect_db()

    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. Parse/Extract
        structured_data = pipeline_extract(file_path)
    finally:
        # Cleanup: Delete the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"[INFO] Cleaned up temp file: {file_path}")

    # 2. Embed
    views = resume_to_views(structured_data)
    
    # Generate embeddings (Use global embedder)
    embeddings_map = embedder.embed_views(views)

    # 3. Store in MongoDB
    doc_id = None
    
    # Ensure DB is connected before saving
    if db is None:
        connect_db()
        
    if db is not None:
        print("[DEBUG] Attempting to insert into MongoDB...")
        resume_doc = {
            "filename": file.filename,
            "uploadDate": datetime.utcnow(),
            "parsed_data": structured_data,
            "embeddings": embeddings_map,
            # views can also be stored for debugging/display
            "views": views 
        }
        try:
            result = db["parsed_resumes"].insert_one(resume_doc)
            doc_id = str(result.inserted_id)
            print(f"[INFO] Saved resume to MongoDB with ID: {doc_id}")
        except Exception as e:
            print(f"[ERROR] Error saving to MongoDB: {e}")
    else:
        print("[ERROR] Database handle is None, skipping save.")

    return {
        "success": True,
        "data": structured_data,
        "db_id": doc_id
    }

from pydantic import BaseModel

class JobData(BaseModel):
    jobTitle: str
    jobDescription: str
    skills: str
    experience: str

@app.post("/embed-job")
async def embed_job(data: JobData):
    # Construct views similarly to resume views
    # This aligns with how the matcher expects JD embeddings
    
    # Combine skills into a single string if not already
    skills_text = data.skills
    
    views = {
        "skills": skills_text,
        "experience": data.experience,
        "full_text": f"{data.jobTitle} {data.jobDescription} {skills_text} {data.experience}",
        "phrases": f"{data.jobTitle} {skills_text}", # Populate phrases with high-signal keywords
        "education": "", # Usually not specific in JD text blocks in this context
        "projects": "",
        "certifications": ""
    }

    # Use global embedder
    embeddings_map = embedder.embed_views(views)
    
    # Also add the _skills_text meta field if needed by matcher
    embeddings_map["_skills_text"] = skills_text

    return {
        "success": True,
        "embeddings": embeddings_map
    }
