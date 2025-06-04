from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from extractor import PDFExtractor
from chatbot import generate_flashcards_from_text
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/flashcards")
async def generate_flashcards(file: UploadFile = File(...)):
    try:
        # Save uploaded PDF temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Extract and clean PDF text
        extractor = PDFExtractor()
        text = extractor.extract_clean_text(tmp_path)

        # Generate flashcards from text
        flashcards = generate_flashcards_from_text(text)

        return {"success": True, "flashcards": flashcards}

    except Exception as e:
        return {"success": False, "error": str(e)}