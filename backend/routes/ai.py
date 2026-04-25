from fastapi import APIRouter, HTTPException, UploadFile, File
from groq import Groq
from dotenv import load_dotenv
import os
import pdfplumber
import io

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_from_pdf(file_bytes):
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF reading failed: {str(e)}")
    return text

@router.post("/generate")
async def generate_questions(
    syllabus_pdf: UploadFile = File(...),
    past_papers_pdf: UploadFile = File(None),
):
    syllabus_bytes = await syllabus_pdf.read()
    syllabus_text = extract_text_from_pdf(syllabus_bytes)

    if not syllabus_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from syllabus PDF. Please use a text-based PDF, not a scanned image.")

    past_papers_text = ""
    if past_papers_pdf and past_papers_pdf.filename:
        past_bytes = await past_papers_pdf.read()
        past_papers_text = extract_text_from_pdf(past_bytes)

    prompt = f"""You are an expert academic question paper generator for college exams.

You have been given:
1. SYLLABUS: The topics covered in the course
2. PAST PAPERS: Previous year exam questions

SYLLABUS:
{syllabus_text[:3000]}

PAST PAPERS CONTENT:
{past_papers_text[:3000]}

Based on the syllabus topics and patterns from past papers, generate a practice exam paper with:
- 5 Short Answer Questions (2 marks each)
- 5 Medium Questions (5 marks each)
- 3 Long Answer Questions (10 marks each)

Focus on topics that appear frequently in past papers.
Format the output clearly with section headings and question numbers.
Also mention the probability/importance of each topic at the end."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=2000,
        )
        result = response.choices[0].message.content
        return {"questions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))