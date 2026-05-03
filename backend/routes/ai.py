from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from groq import Groq
from dotenv import load_dotenv
import os
import pdfplumber
import io
import httpx

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_pdfplumber(file_bytes):
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception:
        pass
    return text.strip()

async def extract_text_ocr(file_bytes, filename):
    try:
        async with httpx.AsyncClient(timeout=60) as http:
            response = await http.post(
                "https://api.ocr.space/parse/image",
                data={
                    "apikey": os.getenv("OCR_SPACE_API_KEY"),
                    "language": "eng",
                    "isOverlayRequired": False,
                    "detectOrientation": True,
                    "scale": True,
                    "OCREngine": 2,
                },
                files={"file": (filename, file_bytes, "application/pdf")},
            )
        print("OCR STATUS:", response.status_code)
        print("OCR RESPONSE:", response.text[:500])
        result = response.json()
        if result.get("IsErroredOnProcessing"):
            print("OCR ERROR:", result.get("ErrorMessage"))
            return ""
        pages = result.get("ParsedResults", [])
        return "\n".join(p.get("ParsedText", "") for p in pages).strip()
    except Exception as e:
        print("OCR EXCEPTION:", str(e))
        return ""

async def extract_text_from_pdf(file_bytes, filename="syllabus.pdf"):
    text = extract_text_pdfplumber(file_bytes)
    print("PDFPLUMBER TEXT LENGTH:", len(text))

    if len(text) < 100:
        print("Falling back to OCR...")
        text = await extract_text_ocr(file_bytes, filename)
        print("OCR TEXT LENGTH:", len(text))

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF. Please ensure the PDF is not password protected."
        )

    return text

@router.post("/generate")
async def generate_questions(
    syllabus_pdf: UploadFile = File(...),
    past_papers_pdf: UploadFile = File(None),
):
    syllabus_bytes = await syllabus_pdf.read()
    syllabus_text = await extract_text_from_pdf(syllabus_bytes, syllabus_pdf.filename)

    past_papers_text = ""
    if past_papers_pdf and past_papers_pdf.filename:
        past_bytes = await past_papers_pdf.read()
        past_papers_text = await extract_text_from_pdf(past_bytes, past_papers_pdf.filename)

    prompt = f"""You are an expert academic question paper generator for Indian university college exams.

SYLLABUS CONTENT:
{syllabus_text[:3000]}

PAST PAPERS FOR REFERENCE ONLY - DO NOT COPY THESE QUESTIONS:
{past_papers_text[:2000]}

YOUR TASK:

Step 1 - READ the syllabus carefully and identify:
- Course name and subject code
- Total marks, time allowed, pass percentage
- Number of sections (A, B, C etc.)
- Topics under each section
- EXACT exam pattern from "Instruction for Paper Setter" and "Instruction for Candidates"

Step 2 - UNDERSTAND the exact pattern from syllabus instructions:
- How many questions in each section
- Marks per question
- How many questions to attempt
- Calculate total marks correctly

Step 3 - If past papers provided, use them ONLY to:
- Identify which topics are asked more frequently
- Understand question style (descriptive, analytical etc.)
- DO NOT copy or reuse any question from past papers
- DO NOT use same wording as past papers

Step 4 - Generate BRAND NEW practice questions that:
- Are completely different from past paper questions
- Follow EXACT same pattern as found in syllabus
- Cover topics from correct sections only
- Are university-level and detailed

STRICT RULES:
- Section C questions must ALL carry EQUAL marks as per syllabus (e.g. if 10 questions for 30 marks = 3 marks each)
- NEVER copy questions from past papers — generate fresh questions only
- Total marks must match syllabus exactly
- Section A topics only in Section A, Section B topics only in Section B
- Write instructions clearly before each section

FORMAT:
[Subject Name and Code]
Time Allowed: [X Hours] | Maximum Marks: [X] | Pass Percentage: [X%]

Instructions for Candidates: [from syllabus]

SECTION A ([X] Marks)
[Instructions: Attempt any X questions. Each question carries X marks.]
1. [Fresh question on Section A topic] ([X] Marks)
2. [Fresh question on Section A topic] ([X] Marks)
...

SECTION B ([X] Marks)  
[Instructions: Attempt any X questions. Each question carries X marks.]
1. [Fresh question on Section B topic] ([X] Marks)
...

SECTION C ([X] Marks)
[Instructions: Attempt ALL questions. Each question carries X marks.]
1. [Fresh short answer question] ([X] Marks)
...

--- Important Topics (based on past papers) ---
[List topics by frequency/importance]

Generate the complete practice paper now:"""

    def stream_response():
        try:
            stream = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=2000,
                stream=True,
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta
        except Exception as e:
            yield f"\n\nError: {str(e)}"

    return StreamingResponse(stream_response(), media_type="text/plain")