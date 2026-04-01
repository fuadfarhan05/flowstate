from collections import Counter
from typing import Any
import json
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
import pdfplumber
import re
from openai import AsyncOpenAI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server -> frontend server.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


EXPERIENCE_HEADERS = [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "relevant experience",
    "work history"
]

SECTION_HEADERS = [
    "experience",
    "work experience",
    "professional experience",
    "employment history",
    "relevant experience",
    "work history",
    "education",
    "skills",
    "projects",
    "certifications",
    "leadership",
    "activities"
]

date_pattern = re.compile(
      r"""
    \b\d{1,2}[/-]\d{1,2}([/-]\d{2,4})?\b |   #date format
    \b\d{1,2}[/-]\d{2,4}\b                 
    """,
    re.VERBOSE


)

date_words = [
    "present",
    "january", "jan",
    "february", "feb",
    "march", "mar",
    "april", "apr",
    "may",
    "june", "jun",
    "july", "jul",
    "august", "aug",
    "september", "sep", "sept",
    "october", "oct",
    "november", "nov",
    "december", "dec",
    "01",
    "02", 
    "03",
    "04", 
    "05", 
    "06", 
    "07",
    "08", 
    "09", 
    "10",
    "11",
    "12"
]


bulletpoints = []
header = []

TOKEN_PATTERN = re.compile(r"[a-zA-Z']+")
FILLER_PHRASES = [
    "um",
    "uh",
    "erm",
    "ah",
    "like",
    "you know",
    "i mean",
    "sort of",
    "kind of",
    "actually",
    "basically",
    "literally",
    "well",
]
FILLER_TOKEN_MAP = {
    phrase: tuple(part for part in phrase.split(" ") if part) for phrase in FILLER_PHRASES
}
SORTED_FILLER_TOKENS = sorted(
    FILLER_TOKEN_MAP.items(), key=lambda item: len(item[1]), reverse=True
)


class FillerAnalysisRequest(BaseModel):
    transcript: str = ""
    window_size_words: int = Field(default=20, ge=5, le=120)
    step_words: int = Field(default=5, ge=1, le=60)
    elapsed_seconds: float | None = Field(default=None, gt=0)


def normalize_tokens(text: str) -> list[str]:
    return [token.strip("'").lower() for token in TOKEN_PATTERN.findall(text) if token.strip("'")]


def count_fillers_in_tokens(tokens: list[str]) -> Counter:
    counts = Counter()
    i = 0
    while i < len(tokens):
        matched = False
        for filler_phrase, filler_tokens in SORTED_FILLER_TOKENS:
            width = len(filler_tokens)
            if tokens[i : i + width] == list(filler_tokens):
                counts[filler_phrase] += 1
                i += width
                matched = True
                break
        if not matched:
            i += 1
    return counts


def build_sliding_windows(tokens: list[str], window_size: int, step: int) -> list[dict[str, Any]]:
    if not tokens:
        return []

    windows = []
    if len(tokens) <= window_size:
        starts = [0]
    else:
        starts = list(range(0, len(tokens) - window_size + 1, step))
        if starts[-1] != len(tokens) - window_size:
            starts.append(len(tokens) - window_size)

    for start in starts:
        end = min(start + window_size, len(tokens))
        window_tokens = tokens[start:end]
        filler_counts = count_fillers_in_tokens(window_tokens)
        filler_total = sum(filler_counts.values())
        word_total = len(window_tokens)
        density = round((filler_total / word_total) * 100, 2) if word_total else 0.0
        windows.append(
            {
                "start_word": start + 1,
                "end_word": end,
                "word_count": word_total,
                "filler_total": filler_total,
                "density_percent": density,
                "top_fillers": filler_counts.most_common(3),
            }
        )

    return windows


@app.post("/analyze-filler-words")
async def analyze_filler_words(payload: FillerAnalysisRequest):
    normalized_text = payload.transcript.strip()
    tokens = normalize_tokens(normalized_text)

    if not tokens:
        return {
            "word_count": 0,
            "filler_total": 0,
            "filler_density_percent": 0.0,
            "filler_counts": {},
            "sliding_windows": [],
            "recent_windows": [],
            "speaking_speed_wpm": None,
            "filler_rate_per_minute": None,
        }

    filler_counts = count_fillers_in_tokens(tokens)
    filler_total = sum(filler_counts.values())
    filler_density = round((filler_total / len(tokens)) * 100, 2)

    windows = build_sliding_windows(
        tokens=tokens,
        window_size=payload.window_size_words,
        step=payload.step_words,
    )

    speaking_speed_wpm = None
    filler_rate_per_minute = None
    if payload.elapsed_seconds:
        minutes = payload.elapsed_seconds / 60.0
        speaking_speed_wpm = round(len(tokens) / minutes, 2) if minutes > 0 else None
        filler_rate_per_minute = round(filler_total / minutes, 2) if minutes > 0 else None

    return {
        "word_count": len(tokens),
        "filler_total": filler_total,
        "filler_density_percent": filler_density,
        "filler_counts": dict(filler_counts.most_common()),
        "sliding_windows": windows,
        "recent_windows": windows[-3:],
        "speaking_speed_wpm": speaking_speed_wpm,
        "filler_rate_per_minute": filler_rate_per_minute,
    }


EXTRACTION_SYSTEM_PROMPT = """
You are an expert interview coach extracting STAR components from candidate transcripts.

Here is a labeled example:

TRANSCRIPT:
"At my internship at Google, our team's API was timing out under load.
I was responsible for diagnosing the bottleneck. I profiled the service
using py-spy, found a blocking DB call in a hot path, and replaced it
with an async query. Response time dropped from 800ms to 120ms."

EXTRACTION:
{
  "situation": {
    "state": "FILLED",
    "quote": "our team's API was timing out under load",
    "note": "Specific technical context established."
  },
  "task": {
    "state": "FILLED",
    "quote": "I was responsible for diagnosing the bottleneck",
    "note": "Clear personal ownership stated."
  },
  "action": {
    "state": "FILLED",
    "quote": "I profiled the service using py-spy, found a blocking DB call, replaced it with an async query",
    "note": "Personal, specific, technical — no 'we'."
  },
  "result": {
    "state": "FILLED",
    "quote": "Response time dropped from 800ms to 120ms",
    "note": "Quantified, measurable outcome."
  }
}

---

Now extract from the transcript the user provides using the same shape.
Respond ONLY with valid JSON.
"""

openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class StarAnalysisRequest(BaseModel):
    transcript: str


@app.post("/analyze-star")
async def analyze_star(payload: StarAnalysisRequest):
    transcript = payload.transcript.strip()
    if not transcript:
        raise HTTPException(status_code=400, detail="Transcript is empty")

    response = await openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": EXTRACTION_SYSTEM_PROMPT},
            {"role": "user", "content": transcript},
        ],
        temperature=0,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content
    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse model response as JSON")

    return result


# ----------------------------
# Clean resume text
# ----------------------------
def clean_resume_text(text: str) -> str:
    # Normalize bullets
    text = re.sub(r"[•●▪–—]", "-", text)

    # Remove multiple spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Normalize newlines
    text = re.sub(r"\n{2,}", "\n\n", text)

    # Remove page numbers
    text = re.sub(r"\nPage \d+\n", "\n", text)

    return text.strip()


# ----------------------------
# Extract sections from resume
# ----------------------------
def extract_sections(text: str) -> dict:
    sections = {}
    lower_text = text.lower()

    header_positions = []

    for header in SECTION_HEADERS:
        for match in re.finditer(rf"\n\s*{header}\s*\n", lower_text):
            header_positions.append((match.start(), header))

    header_positions.sort()

    for i, (start, header) in enumerate(header_positions):
        end = header_positions[i + 1][0] if i + 1 < len(header_positions) else len(text)
        sections[header] = text[start:end].strip()

    return sections


        

header = []

def contains_date(line):
    for word in line.lower().split():
        if word in date_words:
            return True
    if date_pattern.search(line):
        return True
    
    return False
        
    


        
def make_headers(experience_string):
    l = 0

    while l < len(experience_string):
        r = l
        while r < len(experience_string) and experience_string[r] != "\n":
            r += 1

        line = experience_string[l:r]
        if contains_date(line):
            header.append(line)
        
        l = r + 1
        
    



def organize_experience(experience_str):
    lines = experience_str.split("\n")
    organized_map = {}

    i = 0
    while i < len(lines):
        line = lines[i]

        # check if this line is a header
        if line in header:
            current_header = line
            organized_map[current_header] = []

            j = i + 1
            while j < len(lines) and lines[j] not in header:
                organized_map[current_header].append(lines[j])
                j += 1

            i = j  # jump to next section
        else:
            i += 1

    return organized_map


##route
@app.post("/parse-resume")
async def parse_resume(upload: UploadFile = File(...)):
    if not upload.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    raw_text = ""

    try:
        with pdfplumber.open(upload.file) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    raw_text += page_text + "\n"
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to read PDF")

    cleaned_text = clean_resume_text(raw_text)
    sections = extract_sections(cleaned_text)

    experience_text = None
    for key in sections:
        if key in EXPERIENCE_HEADERS:
            experience_text = sections[key]
            break

    make_headers(experience_text)

    return {
        "experiences": organize_experience(experience_text)
    }
