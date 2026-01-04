from fastapi import FastAPI, UploadFile, File, HTTPException
import pdfplumber
import re

app = FastAPI()

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





def split(line):
    word_split = line.split()
    for i in word_split:
        if i.lower() in date_words:
            return True
    return False


        
def get_header_array(experience_string):
    l = 0

    while l < len(experience_string):
        r = l
        while r < len(experience_string) and experience_string[r] != "\n":
            r += 1

        line = experience_string[l:r]
        if split(line):
            header.append(line)
        
        l = r + 1
        
    return header


def get_bulletpoints(experience_string):
    i = 0
    
    while i < len(experience_string) and experience_string[i] != "-":
        i += 1
    
    l = i

    while l < len(experience_string):
        r = l
        while r < len(experience_string) and experience_string[r] != "-":
            r += 1
            
        bulletpoints.append(experience_string[l:r]);

        l = r + 1
    
    return bulletpoints




##route
@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")

    raw_text = ""

    try:
        with pdfplumber.open(file.file) as pdf:
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
    
    experience_names = get_header_array(experience_text)
    bulletpoints = get_bulletpoints(experience_text)



    return {
        #"experience": experience_text,
        #"sections_found": list(sections.keys())
        "headers": experience_names,
        "bulletpoints": bulletpoints
        
    }
