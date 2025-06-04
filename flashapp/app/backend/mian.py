from extractor import PDFExtractor
from chatbot import generate_flashcards_from_text

def main():
    pdf_path = input("Enter path to the PDF file: ").strip()

    # Extract clean text from PDF
    extractor = PDFExtractor()
    try:
        text = extractor.extract_clean_text(pdf_path)
    except Exception as e:
        print(f"Failed to extract PDF text: {e}")
        return

    if not text or len(text) < 100:
        print("The extracted content is too short to generate flashcards.")
        return

    # Generate flashcards
    print("\nGenerating flashcards...\n")
    try:
        flashcards = generate_flashcards_from_text(text)
        print("Flashcards generated:\n")
        print(flashcards)
    except Exception as e:
        print(f"Failed to generate flashcards: {e}")

if __name__ == "__main__":
    main()