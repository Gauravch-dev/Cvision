from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from pymongo import MongoClient, errors
from bson import ObjectId
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

from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "saved_resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve saved resumes statically
app.mount("/resumes", StaticFiles(directory=UPLOAD_DIR), name="resumes")

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

import hashlib
from fastapi.concurrency import run_in_threadpool

@app.post("/extract-resume")
async def extract_resume_endpoint(
    file: UploadFile = File(...), 
    job_id: str = Form(None), # Accept job_id from frontend (multipart/form-data)
    user_id: str = Form(None) # Multi-tenancy: Associate resume with user
):
    global db
    if db is None:
        print("[INFO] Database handle missing, attempting to reconnect...")
        connect_db()

    # --- DEDUPLICATION START ---
    # 1. Compute File Hash
    file_content = await file.read()
    file_hash = hashlib.md5(file_content).hexdigest()
    
    # 2. Check if hash exists in DB
    if db is not None:
        existing_doc = db["parsed_resumes"].find_one({"file_hash": file_hash, "jobId": job_id})
        if existing_doc:
            print(f"[INFO] Duplicate Resume Found (Hash: {file_hash}). Returning existing data.")
            return {
                "success": True,
                "data": existing_doc.get("parsed_data"),
                "db_id": str(existing_doc.get("_id")),
                "stored_filename": existing_doc.get("stored_filename"),
                "is_duplicate": True
            }

    # 3. Reset Cursor for Saving
    await file.seek(0)
    # --- DEDUPLICATION END ---

    # Save with UUID to prevent collisions
    stored_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. Parse/Extract (Run in threadpool to unblock event loop)
        structured_data = await run_in_threadpool(pipeline_extract, file_path)
        
        # NOTE: File is KEPT for download access (no finally/cleanup block)
        print(f"[INFO] Persisting file at: {file_path}")

    except Exception as e:
        print(f"[ERROR] Extraction failed: {e}")
        return {"success": False, "error": str(e)}

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
            "userId": user_id,     # Multi-tenancy: Link to user
            "jobId": job_id,           # Link to specific Job ID
            "filename": file.filename,
            "stored_filename": stored_filename, # 🆕 Saved on disk name
            "file_hash": file_hash,    # 🆕 Deduplication Key
            "uploadDate": datetime.utcnow(),
            "parsed_data": structured_data,
            "embeddings": embeddings_map,
            # views can also be stored for debugging/display
            "views": views 
        }
        try:
            result = db["parsed_resumes"].insert_one(resume_doc)
            doc_id = str(result.inserted_id)
            print(f"[INFO] Saved resume to MongoDB with ID: {doc_id} for Job: {job_id}")

            # 4. Increment Resume Count on Job Requirement
            if job_id:
                try:
                    # Fix: Ensure logic handles cases where resumeCount field might not initialy exist
                    update_result = db["jobrequirements"].update_one(
                        {"_id": ObjectId(job_id)},
                        {"$inc": {"resumeCount": 1}}
                    )
                    if update_result.modified_count > 0:
                        print(f"[INFO] Incremented resumeCount for Job: {job_id}")
                    else:
                        print(f"[WARN] Job ID {job_id} not found or count not updated")
                except Exception as e:
                    print(f"[ERROR] Failed to increment resumeCount: {e}")

        except Exception as e:
            print(f"[ERROR] Error saving to MongoDB: {e}")
    else:
        print("[ERROR] Database handle is None, skipping save.")

    return {
        "success": True,
        "data": structured_data,
        "db_id": doc_id,
        "stored_filename": stored_filename # Return this so frontend knows the URL immediately if needed
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
