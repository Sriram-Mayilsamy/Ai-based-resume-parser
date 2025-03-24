from fastapi import FastAPI, File, UploadFile, Form
import fitz  # PyMuPDF for extracting text
import google.generativeai as genai
import json
import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, Form, Query


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
genai.configure(api_key="AIzaSyA5S8xWoFOizc_AE9gNgG_-kPRPnJSeCgE")

# Path for local database file
DB_FILE = "db.json"

# Define Schema
schema = {
    "name": "string",
    "email": "string",
    "phone": "string",
    "skills": "list",
    "experience": "list",
    "education": "list",
}
def read_db():
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, "r") as f:
        try:
            data = json.load(f)
            return data if isinstance(data, list) else []
        except json.JSONDecodeError:
            return []

def extract_text_from_pdf(pdf_data):
    pdf_text = ""
    pdf = fitz.open(stream=pdf_data, filetype="pdf")
    for page in pdf:
        pdf_text += page.get_text("text") + "\n"
    return pdf_text.strip()

# Gemini AI API Request
def ask_gemini(prompt):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    if not response.text:
        return {"error": "Empty response from AI"}

    try:
        json_start = response.text.find("{")
        json_end = response.text.rfind("}") + 1
        json_data = response.text[json_start:json_end]
        return json.loads(json_data)
    except json.JSONDecodeError:
        return {"error": "AI returned an invalid JSON response"}

# Save user data to local db.json
def save_to_db(user_data):
    db_data = read_db()

    # Check if user already exists (update instead of duplicate entry)
    for entry in db_data:
        if entry["email"] == user_data["email"] and entry["expected_role"] == user_data["expected_role"]:
            entry.update(user_data)
            break
    else:
        # Assign a unique ID
        user_data["id"] = len(db_data) + 1  # Simple ID generation
        db_data.append(user_data)

    # Save back to file
    with open(DB_FILE, "w") as f:
        json.dump(db_data, f, indent=4)






# Resume Analysis API
@app.post("/upload")
async def upload_resume(file: UploadFile = File(...), role: str = Form(...)):
    pdf_data = await file.read()
    resume_text = extract_text_from_pdf(pdf_data)

    if not resume_text:
        return {"error": "Failed to extract text from resume"}

    # Extract structured resume info
    prompt_resume = f"""
    Extract structured information from the following resume text.
    *Return only a valid JSON object* without explanations, pre-text, or markdown.

    Schema:
    {json.dumps(schema, indent=2)}

    Resume Text:
    {resume_text}

    *Important:* Your response must be valid JSON.
    """
    resume_data = ask_gemini(prompt_resume)
    if "error" in resume_data:
        return resume_data

    # Extract name, email, phone
    name = resume_data.get("name", "Unknown")
    email = resume_data.get("email", "Unknown")
    phone = resume_data.get("phone", "Unknown")
    skills = resume_data.get("skills", [])

    # Step 1: Extract mandatory skills for the role
    prompt_role_skills = f"""
    What are the essential skills required for a *{role}*?
    Provide a structured response in JSON format.

    *Output Format (valid JSON only):*
    {{
      "required_skills": ["Skill1", "Skill2", "Skill3", ...]
    }}
    """
    role_skills_data = ask_gemini(prompt_role_skills)
    required_skills = role_skills_data.get("required_skills", [])

    # Step 2: Compare resume skills with required skills
    matching_skills = list(set(skills) & set(required_skills))
    missing_skills = list(set(required_skills) - set(skills))

    # Step 3: Calculate Job Match Percentage
    match_percentage = round((len(matching_skills) / len(required_skills)) * 100) if required_skills else 0

    # Analyze role eligibility
    prompt_eligibility = f"""
    The candidate wants to be a *{role}*.
    Analyze their current skills and determine if they are eligible for this role.
    If they lack any necessary skills, list those missing skills with learning resources.

    *Current Skills:*
    {json.dumps(skills, indent=2)}

    *Output Format (valid JSON only):*
    {{
      "eligibility": "Eligible" or "Not Eligible",
      "missing_skills": [
        {{"skill": "Skill Name", "learning_resource": "Suggested Course"}}
      ]
    }}

    *Important:* Return a valid JSON object only.
    """
    eligibility_data = ask_gemini(prompt_eligibility)

    # Recommend job roles
    prompt_roles = f"""
    Based on the following skills, recommend the *most suitable job roles* for the candidate.

    *Skills:*
    {json.dumps(skills, indent=2)}

    *Output Format (valid JSON only):*
    {{
      "recommended_roles": ["Role 1", "Role 2", "Role 3"]
    }}
    """
    job_roles = ask_gemini(prompt_roles)

    # Resume Evaluation (Job-Specific)
    prompt_evaluation = f"""
    Evaluate the quality of the following resume specifically for the role of *{role}*.

    Analyze whether the resume effectively highlights skills, experience, and projects relevant to the *{role}* position.
    Provide structured feedback with a strict role-based evaluation.

    *Resume Text:*
    {resume_text}

    *Job Role:*
    {role}

    *Skills Required for the Role:*
    {json.dumps(required_skills, indent=2)}

    *Output Format (valid JSON only):*
    {{
    "relevance_to_role": "Score (1-100)",
    "skill_coverage": "Score (1-100)",
    "experience_alignment": "Score (1-100)",
    "project_relevance": "Score (1-100)",
    "industry_insights": "Score (1-100)",
    "job_specific_achievements": "Score (1-100)",
    "education_certifications": "Score (1-100)",
    "overall_score": "Weighted Average Score",
    "areas_of_improvement": [
        "1. Suggestion 1",
        "2. Suggestion 2"
    ]
    }}

    *Important:* Return a valid JSON object only.
    """


    resume_evaluation = ask_gemini(prompt_evaluation)

    # Save user data to db.json
    user_data = {
    "name": name,
    "email": email,
    "phone": phone,
    "expected_role": role,
    "relevancy_score": resume_evaluation.get("overall_score", match_percentage),
    "resume_scores": {
        "relevance_to_role": resume_evaluation.get("relevance_to_role", 0),
        "skill_coverage": resume_evaluation.get("skill_coverage", 0),
        "experience_alignment": resume_evaluation.get("experience_alignment", 0),
        "project_relevance": resume_evaluation.get("project_relevance", 0),
        "industry_insights": resume_evaluation.get("industry_insights", 0),
        "job_specific_achievements": resume_evaluation.get("job_specific_achievements", 0),
        "education_certifications": resume_evaluation.get("education_certifications", 0),
        "overall_score": resume_evaluation.get("overall_score", match_percentage),
    }
}




    save_to_db(user_data)

    return {
        "resume_data": resume_data,
        "eligibility": eligibility_data,
        "recommended_roles": job_roles,
        "resume_evaluation": resume_evaluation,
        "job_match": {
            "match_percentage": match_percentage,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills
        }
    }
