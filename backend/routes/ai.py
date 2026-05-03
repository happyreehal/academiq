from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from groq import Groq
from dotenv import load_dotenv
import os
import pdfplumber
import io
import base64
import pypdfium2 as pdfium

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

def extract_text_groq_vision(file_bytes):
    try:
        pdf = pdfium.PdfDocument(io.BytesIO(file_bytes))
        all_text = ""
        for i in range(min(3, len(pdf))):
            page = pdf[i]
            bitmap = page.render(scale=1.5)
            img = bitmap.to_pil()
            buf = io.BytesIO()
            img.save(buf, format="JPEG", quality=85)
            b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
            response = client.chat.completions.create(
                model="meta-llama/llama-4-scout-17b-16e-instruct",
                messages=[{
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
                        },
                        {
                            "type": "text",
                            "text": "Extract all text from this image exactly as it appears. Include all headings, instructions, topics, marks, and any other text visible."
                        }
                    ]
                }],
                max_tokens=2000,
            )
            all_text += response.choices[0].message.content + "\n"
        return all_text.strip()
    except Exception as e:
        print("GROQ VISION ERROR:", str(e))
        return ""

async def extract_text_from_pdf(file_bytes, filename="syllabus.pdf", required=True):
    text = extract_text_pdfplumber(file_bytes)
    print("PDFPLUMBER TEXT LENGTH:", len(text))

    if len(text) < 100:
        print("Falling back to Groq Vision OCR...")
        text = extract_text_groq_vision(file_bytes)
        print("GROQ VISION TEXT LENGTH:", len(text))

    if not text.strip():
        if required:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from syllabus PDF. Please ensure the PDF is not password protected."
            )
        else:
            print("PDF extraction failed - skipping")
            return ""

    return text

@router.post("/generate")
async def generate_questions(
    syllabus_pdf: UploadFile = File(...),
    past_papers_pdf: UploadFile = File(None),
):
    syllabus_bytes = await syllabus_pdf.read()
    syllabus_text = await extract_text_from_pdf(syllabus_bytes, syllabus_pdf.filename, required=True)

    past_papers_text = ""
    if past_papers_pdf and past_papers_pdf.filename:
        past_bytes = await past_papers_pdf.read()
        past_papers_text = await extract_text_from_pdf(past_bytes, past_papers_pdf.filename, required=False)

    prompt = f"""You are an expert academic question paper generator for Indian university college exams.

SYLLABUS CONTENT:
{syllabus_text[:3000]}

PAST PAPERS FOR REFERENCE ONLY - DO NOT COPY THESE QUESTIONS:
{past_papers_text[:2000]}

YOUR TASK:

Step 1 - READ the syllabus carefully and identify:
- Course name and subject code
- Time allowed, pass percentage
- Number of sections and topics under each section

Step 2 - CALCULATE MARKS LIKE THIS:
- Find "External Examination" marks in syllabus — this is your TOTAL
- Find "Instruction for Paper Setter" — it tells section wise breakdown
- Example from a typical syllabus:
  * "Sections A & B will have FOUR questions each carrying 10 marks"
  * "Attempt any TWO from each section" → Section A = 2x10 = 20 marks, Section B = 2x10 = 20 marks
  * "Section C will have 10 short-answer questions carrying 30 marks" → Section C = 30 marks
  * Total = 20 + 20 + 30 = 70 marks ✓ matches External marks
- ALWAYS verify: Section A + Section B + Section C = External marks total
- NEVER use Internal Assessment marks

Step 3 - STRICTLY follow this question count:
- Section A: EXACTLY 4 questions, student attempts ANY 2, each question = (Section A marks / 2)
- Section B: EXACTLY 4 questions, student attempts ANY 2, each question = (Section B marks / 2)
- Section C: EXACTLY 10 questions, ALL compulsory, each question = (Section C marks / 10)
- Double check: 2 x (marks per question in A) + 2 x (marks per question in B) + 10 x (marks per question in C) = External total

Step 4 - If past papers provided, use ONLY to:
- Identify frequently asked topics
- Understand question style
- NEVER copy or reuse any question from past papers
- NEVER use same wording as past papers

Step 5 - Generate BRAND NEW practice questions:
- Completely different from past paper questions
- Section A topics only in Section A of syllabus
- Section B topics only in Section B of syllabus
- Questions must be university-level and detailed

FORMAT (follow EXACTLY):
[Subject Name and Code]
Time Allowed: [X Hours] | Maximum Marks: [External Marks ONLY] | Pass Percentage: [X%]

Note: Attempt any two questions each from Section A & B. Attempt all questions in Section C.

SECTION A ([total attempted marks] Marks)
Attempt any 2 questions. Each question carries [X] marks.
1. [Fresh question on Section A topic] ([X] Marks)
2. [Fresh question on Section A topic] ([X] Marks)
3. [Fresh question on Section A topic] ([X] Marks)
4. [Fresh question on Section A topic] ([X] Marks)

SECTION B ([total attempted marks] Marks)
Attempt any 2 questions. Each question carries [X] marks.
1. [Fresh question on Section B topic] ([X] Marks)
2. [Fresh question on Section B topic] ([X] Marks)
3. [Fresh question on Section B topic] ([X] Marks)
4. [Fresh question on Section B topic] ([X] Marks)

SECTION C ([X] Marks)
Attempt ALL 10 questions. Each question carries [X] marks.
1. [Fresh short answer] ([X] Marks)
2. [Fresh short answer] ([X] Marks)
3. [Fresh short answer] ([X] Marks)
4. [Fresh short answer] ([X] Marks)
5. [Fresh short answer] ([X] Marks)
6. [Fresh short answer] ([X] Marks)
7. [Fresh short answer] ([X] Marks)
8. [Fresh short answer] ([X] Marks)
9. [Fresh short answer] ([X] Marks)
10. [Fresh short answer] ([X] Marks)

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
                    yield delta.encode("utf-8")
        except Exception as e:
            yield f"\n\nError: {str(e)}".encode("utf-8")

    return StreamingResponse(
        stream_response(),
        media_type="text/plain; charset=utf-8",
        headers={
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
        }
    )