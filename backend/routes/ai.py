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

PAST PAPERS (use these to understand exam pattern and important topics):
{past_papers_text[:2000]}

YOUR TASK:
Step 1 - READ the syllabus carefully and identify:
- How many sections are there (Section A, B, C etc.)
- What topics fall under each section
- The course name and subject code if mentioned

Step 2 - READ the exam instructions in the syllabus carefully and identify:
- Total marks (e.g. 70, 80, 100)
- Marks per question in each section
- How many questions to attempt in each section
- Number of questions per section
- Any special instructions for paper setter or candidates

Step 3 - READ past papers (if provided) to identify:
- Which topics are asked most frequently
- What type of questions are asked (descriptive, short, MCQ etc.)

Step 4 - Generate a COMPLETE practice question paper that:
- EXACTLY follows the exam pattern found in Step 2
- Uses topics from the correct sections found in Step 1
- Prioritizes important topics found in Step 3
- Has proper instructions at the top (Time allowed, Max marks, Pass %)
- Has proper instructions before each section (how many to attempt, marks each)
- Questions must be relevant, university-level, and detailed

IMPORTANT RULES:
- Do NOT invent a new pattern — strictly follow what is written in the syllabus
- Do NOT mix up sections — Section A topics only in Section A questions
- Total marks of generated paper must match syllabus exactly
- End the paper with: "--- Important Topics (based on past papers) ---" and list likely topics

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