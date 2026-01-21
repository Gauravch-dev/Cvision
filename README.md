# 🦅 Cvision: The Smart Hiring Helper

Imagine you have a big pile of resumes (papers that tell you about a person's job skills) and you need to find the **best person** for a job. Reading them all takes a long time, right?

**Cvision** is a smart robot that reads them for you! 🤖

1.  **You upload resumes** (PDFs).
2.  **You tell it what job you are hiring for** (like "I need a Chef").
3.  **Cvision reads everything** and gives each person a **Score (0-100)** to tell you who is the best match!

---

## 🚀 How to Run It (The Easy Way)

You don't need to be a computer wizard. We made a magic button for you.

### Step 1: Install the tools
Make sure you have `Node.js` and `Python` installed on your computer.

### Step 2: Start the Engines!
Open your terminal (command prompt) in this folder and type:

```bash
npm run dev:all
```

That's it! 
*   It starts the **Website** (Frontend) 🖥️
*   It starts the **Brain** (Python AI) 🧠
*   It starts the **Filing Cabinet** (Backend Database) 🗄️

### Step 3: Use it
Go to `http://localhost:3000` in your web browser. Upload a resume and see the magic happen!

---

## 🛠️ For the Tech Wizards (Developers)

If you want to know how it works inside:

*   **Frontend:** Next.js (The pretty face)
*   **Backend:** Node.js (The connection)
*   **AI Engine:** Python + Sentence Transformers (The thinking part)
*   **Database:** MongoDB (Where we keep the info)

We used **Vector Search** (math with arrows) to find the best matches. It's like finding two stars that are close to each other in the sky. ✨

---

## 🔌 API & Integration Guide (For HR Systems)

Want to connect **Workday**, **Greenhouse**, or your own portal to Cvision? 
Our API makes it easy to auto-parse resumes without human clicks.

### **The Endpoint**
`POST /extract-resume`

### **Python Example (How to call it)**
```python
import requests

# 1. The Resume File
files = {'file': open('resume.pdf', 'rb')}

# 2. The Job ID (Optional, to link it)
data = {'job_id': 'JOB-12345'}

# 3. Send it to Cvision
response = requests.post('http://localhost:8000/extract-resume', files=files, data=data)

# 4. Get the Magic Result (Standard JSON)
print(response.json())
```

### **Sample Response**
```json
{
  "success": true,
  "data": {
    "profile": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "location": "New York, USA"
    },
    "skills": {
      "languages": ["Python", "JavaScript"],
      "ai_detected": ["Docker", "AWS"]
    }
  },
  "stored_filename": "uuid_resume.pdf"
}
```

### **Interactive Docs**
Visit `http://localhost:8000/docs` to see the full Swagger UI and test endpoints directly in your browser.
