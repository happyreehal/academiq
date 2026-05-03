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
- Time allowed, pass percentage
- Number of sections (A, B, C etc.)
- Topics under each section

Step 2 - IDENTIFY MARKS CAREFULLY:
- Syllabus may mention "Maximum Marks: 100", "External: 70", "Internal: 30"
- You must ONLY use EXTERNAL EXAMINATION marks for the question paper
- Internal Assessment marks are given by teacher separately - NEVER include them
- The question paper total = External Examination marks only
- Example: If External = 70, generate paper of 70 marks total
- Read "Instruction for Paper Setter" carefully to understand section-wise marks distribution

Step 3 - UNDERSTAND exact pattern from syllabus:
- How many questions in each section
- Marks per question in each section
- How many questions to attempt per section
- Verify: sum of all section marks = External marks total

Step 4 - If past papers provided, use ONLY to:
- Identify frequently asked topics
- Understand question style
- NEVER copy or reuse any question from past papers
- NEVER use same wording as past papers

Step 5 - Generate BRAND NEW practice questions:
- Completely different from past paper questions
- Follow EXACT pattern from syllabus instructions
- Section A topics only in Section A
- Section B topics only in Section B
- All Section C questions must carry equal marks
- Questions must be university-level and detailed

STRICT RULES:
- Total marks = External marks ONLY (ignore internal/sessional marks)
- NEVER copy questions from past papers
- Section wise marks must add up to external total exactly
- Write clear instructions before each section

FORMAT:
[Subject Name and Code]
Time Allowed: [X Hours] | Maximum Marks: [External Marks only] | Pass Percentage: [X%]

Note: [Instruction for candidates from syllabus]

SECTION A ([X] Marks)
Attempt any [X] questions. Each question carries [X] marks.
1. [Fresh question] ([X] Marks)
2. [Fresh question] ([X] Marks)
3. [Fresh question] ([X] Marks)
4. [Fresh question] ([X] Marks)

SECTION B ([X] Marks)
Attempt any [X] questions. Each question carries [X] marks.
1. [Fresh question] ([X] Marks)
2. [Fresh question] ([X] Marks)
3. [Fresh question] ([X] Marks)
4. [Fresh question] ([X] Marks)

SECTION C ([X] Marks)
Attempt ALL questions. Each question carries [X] marks.
1. [Fresh short answer question] ([X] Marks)
2. [Fresh short answer question] ([X] Marks)
... (total 10 questions)

--- Important Topics (based on past papers) ---
[Topics by importance/frequency]

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