from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from groq import Groq
from dotenv import load_dotenv
import os
import pdfplumber
import io
import base64
import pypdfium2 as pdfium
import random
import time

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ============================================
# PDF EXTRACTION HELPERS
# ============================================

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


# ============================================
# STRICT PROMPT BUILDER (Different questions every time)
# ============================================

def build_prompt(syllabus_text, past_papers_text):
    # Random seed for variety
    seed = random.randint(1000, 9999)
    timestamp = int(time.time())
    
    # Random angles to make questions different each time
    question_angles = [
        "conceptual understanding and theory",
        "practical application and real-world examples",
        "comparative analysis and differentiation",
        "problem-solving and case studies",
        "critical thinking and evaluation",
        "design and implementation aspects",
    ]
    selected_angles = random.sample(question_angles, 3)
    
    return f"""You are an expert Indian university question paper generator with 20+ years of experience.

═══════════════════════════════════════════════════════════
GENERATION ID: {seed}-{timestamp}
═══════════════════════════════════════════════════════════

⚠️ CRITICAL RULES (MUST FOLLOW):
1. Generate COMPLETELY DIFFERENT questions every time
2. NEVER repeat or paraphrase past paper questions
3. Use these question angles this time: {', '.join(selected_angles)}
4. Make questions UNIQUE — different wording, different examples, different scenarios
5. Use creative variations: "Discuss", "Explain", "Compare", "Analyze", "Design", "Evaluate", "Justify", "Illustrate"

═══════════════════════════════════════════════════════════
SYLLABUS CONTENT:
═══════════════════════════════════════════════════════════
{syllabus_text[:3000]}

═══════════════════════════════════════════════════════════
PAST PAPERS (Reference Only - DO NOT COPY):
═══════════════════════════════════════════════════════════
{past_papers_text[:2000] if past_papers_text else "No past papers provided"}

═══════════════════════════════════════════════════════════
MANDATORY FORMAT (FOLLOW EXACTLY):
═══════════════════════════════════════════════════════════

[Subject Name from Syllabus] - [Subject Code]
Time Allowed: 3 Hours | Maximum Marks: 70 | Pass Percentage: 35%

Note: Attempt any two questions each from Section A & B. 
All questions in Section C are compulsory.

═══════════════════════════════════════════════════════════
                    SECTION A (20 Marks)
        Attempt any 2 questions. Each carries 10 marks.
═══════════════════════════════════════════════════════════

1. [Fresh, unique question on Section A topic - 10 Marks]

2. [Fresh, unique question on Section A topic - 10 Marks]

3. [Fresh, unique question on Section A topic - 10 Marks]

4. [Fresh, unique question on Section A topic - 10 Marks]

═══════════════════════════════════════════════════════════
                    SECTION B (20 Marks)
        Attempt any 2 questions. Each carries 10 marks.
═══════════════════════════════════════════════════════════

1. [Fresh, unique question on Section B topic - 10 Marks]

2. [Fresh, unique question on Section B topic - 10 Marks]

3. [Fresh, unique question on Section B topic - 10 Marks]

4. [Fresh, unique question on Section B topic - 10 Marks]

═══════════════════════════════════════════════════════════
                    SECTION C (30 Marks)
        Attempt ALL 10 questions. Each carries 3 marks.
═══════════════════════════════════════════════════════════

1. [Fresh short answer question - 3 Marks]
2. [Fresh short answer question - 3 Marks]
3. [Fresh short answer question - 3 Marks]
4. [Fresh short answer question - 3 Marks]
5. [Fresh short answer question - 3 Marks]
6. [Fresh short answer question - 3 Marks]
7. [Fresh short answer question - 3 Marks]
8. [Fresh short answer question - 3 Marks]
9. [Fresh short answer question - 3 Marks]
10. [Fresh short answer question - 3 Marks]

═══════════════════════════════════════════════════════════
TOTAL: 70 MARKS
═══════════════════════════════════════════════════════════

--- Important Topics (Based on Syllabus & Past Trends) ---
* [Topic 1 with importance level]
* [Topic 2 with importance level]
* [Topic 3 with importance level]
* [Topic 4 with importance level]
* [Topic 5 with importance level]

═══════════════════════════════════════════════════════════
🎯 STRICT ENFORCEMENT:
- Section A: EXACTLY 4 questions (10 marks each)
- Section B: EXACTLY 4 questions (10 marks each)
- Section C: EXACTLY 10 questions (3 marks each)
- TOTAL: 20 + 20 + 30 = 70 marks (MUST MATCH)
- Every question must be UNIQUE and FRESH
- Use generation ID {seed} to ensure variety
═══════════════════════════════════════════════════════════

Now generate the complete practice paper following the EXACT format above:"""


# ============================================
# MAIN ROUTE
# ============================================

@router.post("/generate")
async def generate_questions(
    syllabus_pdf: UploadFile = File(...),
    past_papers_pdf: UploadFile = File(None),
):
    # Extract syllabus text
    syllabus_bytes = await syllabus_pdf.read()
    syllabus_text = await extract_text_from_pdf(
        syllabus_bytes, syllabus_pdf.filename, required=True
    )

    # Extract past papers text (optional)
    past_papers_text = ""
    if past_papers_pdf and past_papers_pdf.filename:
        past_bytes = await past_papers_pdf.read()
        past_papers_text = await extract_text_from_pdf(
            past_bytes, past_papers_pdf.filename, required=False
        )

    # Build dynamic prompt with randomization
    prompt = build_prompt(syllabus_text, past_papers_text)

    def stream_response():
        try:
            stream = client.chat.completions.create(
                model="llama-3.3-70b-versatile",  # Better model for quality
                messages=[
                    {
                        "role": "system",
                        "content": "You are a creative question paper generator. Generate UNIQUE, FRESH questions every time. Never repeat questions. Always follow the exact format provided."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=3000,
                stream=True,
                temperature=0.95,        # HIGH for variety (0-2)
                top_p=0.95,              # HIGH for diverse word choices
                frequency_penalty=0.5,   # Reduce repetition
                presence_penalty=0.5,    # Encourage new topics
                seed=random.randint(1, 999999),  # Different seed every call
            )
            for chunk in stream:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield delta.encode("utf-8")
        except Exception as e:
            yield f"\n\nError: {str(e)}".encode("utf-8")

    return StreamingResponse(
    stream_response(),
    media_type="text/event-stream",  # ← Changed from text/plain
    headers={
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Transfer-Encoding": "chunked",
    }
)