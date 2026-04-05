from collections import Counter
from typing import Any
import os
import re

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
import pdfplumber

app = FastAPI()

# ----------------------------
# CORS CONFIGURATION
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://flowstatebetatesting.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# CONSTANTS
# ----------------------------

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
    \b\d{1,2}[/-]\d{1,2}([/-]\d{2,4})?\b |
    \b\d{1,2}[/-]\d{2,4}\b
    """,
    re.VERBOSE
)

date_words = [
    "present",
    "january","jan",
    "february","feb",
    "march","mar",
    "april","apr",
    "may",
    "june","jun",
    "july","jul",
    "august","aug",
    "september","sep","sept",
    "october","oct",
    "november","nov",
    "december","dec",
    "01","02","03","04","05","06",
    "07","08","09","10","11","12"
]

TOKEN_PATTERN = re.compile(r"[a-zA-Z']+")

FILLER_PHRASES = [
    "um","uh","erm","ah","like",
    "you know","i mean","sort of","kind of",
    "actually","basically","literally","well"
]

FILLER_TOKEN_MAP = {
    phrase: tuple(part for part in phrase.split(" ") if part)
    for phrase in FILLER_PHRASES
}

SORTED_FILLER_TOKENS = sorted(
    FILLER_TOKEN_MAP.items(),
    key=lambda item: len(item[1]),
    reverse=True
)

# ----------------------------
# REQUEST MODEL
# ----------------------------

class FillerAnalysisRequest(BaseModel):
    transcript: str = ""
    window_size_words: int = Field(default=20, ge=5, le=120)
    step_words: int = Field(default=5, ge=1, le=60)
    elapsed_seconds: float | None = Field(default=None, gt=0)

# ----------------------------
# TOKEN UTILITIES
# ----------------------------

def normalize_tokens(text: str) -> list[str]:
    return [
        token.strip("'").lower()
        for token in TOKEN_PATTERN.findall(text)
        if token.strip("'")
    ]


def count_fillers_in_tokens(tokens: list[str]) -> Counter:
    counts = Counter()
    i = 0

    while i < len(tokens):
        matched = False

        for filler_phrase, filler_tokens in SORTED_FILLER_TOKENS:
            width = len(filler_tokens)

            if tokens[i:i+width] == list(filler_tokens):
                counts[filler_phrase] += 1
                i += width
                matched = True
                break

        if not matched:
            i += 1

    return counts


def build_sliding_windows(tokens, window_size, step):

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

        density = round((filler_total / word_total) * 100, 2) if word_total else 0

        windows.append({
            "start_word": start + 1,
            "end_word": end,
            "word_count": word_total,
            "filler_total": filler_total,
            "density_percent": density,
            "top_fillers": filler_counts.most_common(3)
        })

    return windows

# ----------------------------
# FILLER ANALYSIS ROUTE
# ----------------------------

@app.post("/analyze-filler-words")
async def analyze_filler_words(payload: FillerAnalysisRequest):

    normalized_text = payload.transcript.strip()

    tokens = normalize_tokens(normalized_text)

    if not tokens:
        return {
            "word_count": 0,
            "filler_total": 0,
            "filler_density_percent": 0,
            "filler_counts": {},
            "sliding_windows": [],
            "recent_windows": [],
            "speaking_speed_wpm": None,
            "filler_rate_per_minute": None
        }

    filler_counts = count_fillers_in_tokens(tokens)

    filler_total = sum(filler_counts.values())

    filler_density = round((filler_total / len(tokens)) * 100, 2)

    windows = build_sliding_windows(
        tokens,
        payload.window_size_words,
        payload.step_words
    )

    speaking_speed_wpm = None
    filler_rate_per_minute = None

    if payload.elapsed_seconds:

        minutes = payload.elapsed_seconds / 60

        if minutes > 0:
            speaking_speed_wpm = round(len(tokens) / minutes, 2)
            filler_rate_per_minute = round(filler_total / minutes, 2)

    return {
        "word_count": len(tokens),
        "filler_total": filler_total,
        "filler_density_percent": filler_density,
        "filler_counts": dict(filler_counts.most_common()),
        "sliding_windows": windows,
        "recent_windows": windows[-3:],
        "speaking_speed_wpm": speaking_speed_wpm,
        "filler_rate_per_minute": filler_rate_per_minute
    }

# ----------------------------
# RESUME PARSER
# ----------------------------

def clean_resume_text(text):

    text = re.sub(r"[•●▪–—]", "-", text)

    text = re.sub(r"[ \t]+", " ", text)

    text = re.sub(r"\n{2,}", "\n\n", text)

    text = re.sub(r"\nPage \d+\n", "\n", text)

    return text.strip()


def extract_sections(text):

    sections = {}

    lower_text = text.lower()

    header_positions = []

    for header in SECTION_HEADERS:

        for match in re.finditer(rf"\n\s*{header}\s*\n", lower_text):

            header_positions.append((match.start(), header))

    header_positions.sort()

    for i, (start, header) in enumerate(header_positions):

        end = header_positions[i+1][0] if i+1 < len(header_positions) else len(text)

        sections[header] = text[start:end].strip()

    return sections


def contains_date(line):

    for word in line.lower().split():

        if word in date_words:
            return True

    if date_pattern.search(line):
        return True

    return False


def make_headers(experience_string):

    headers = []

    l = 0

    while l < len(experience_string):

        r = l

        while r < len(experience_string) and experience_string[r] != "\n":
            r += 1

        line = experience_string[l:r]

        if contains_date(line):
            headers.append(line)

        l = r + 1

    return headers


def organize_experience(experience_str, headers):

    if not experience_str:
        return {}

    lines = experience_str.split("\n")

    organized_map = {}

    i = 0

    while i < len(lines):

        line = lines[i]

        if line in headers:

            current_header = line

            organized_map[current_header] = []

            j = i + 1

            while j < len(lines) and lines[j] not in headers:

                organized_map[current_header].append(lines[j])

                j += 1

            i = j

        else:
            i += 1

    return organized_map


# ----------------------------
# RESUME ROUTE
# ----------------------------

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

    if not experience_text:
        return {"experiences": {}}

    headers = make_headers(experience_text)

    organized = organize_experience(experience_text, headers)

    return {
        "experiences": organized
    }