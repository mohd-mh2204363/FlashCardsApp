"""
PDF Flashcard Extractor

Extracts and cleans text from PDF files for efficient token use in GPT prompts.
"""

import fitz
import logging
import os
import unicodedata
import re

logger = logging.getLogger(__name__)

class PDFExtractor:
    def extract_clean_text(self, file_path: str) -> str:
        """
        Extract and clean text from a PDF.

        Removes accents, headers, footers, special characters, and reference sections.

        Args:
            file_path (str): Path to the PDF file.

        Returns:
            str: Cleaned and normalized text from the PDF.
        """
        try:
            doc = fitz.open(file_path)
            text = " ".join(page.get_text() for page in doc)
            doc.close()

            # Normalize and remove accents
            text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode()

            # Remove multiple spaces/newlines
            text = re.sub(r'\s+', ' ', text)

            # Remove common headers/footers (page numbers, "Chapter", etc.)
            text = re.sub(r'Page \d+|Chapter \d+', '', text, flags=re.IGNORECASE)

            # Remove reference section if detected
            text = re.split(r'\bReferences\b|\bBibliography\b', text, flags=re.IGNORECASE)[0]

            return text.strip()

        except Exception as e:
            logger.error(f"Error extracting PDF content: {str(e)}")
            raise

def main():
    import sys
    if len(sys.argv) < 2:
        print("Usage: python pdf_flashcard_extractor.py <path_to_pdf>")
        return

    extractor = PDFExtractor()
    try:
        content = extractor.extract_clean_text(sys.argv[1])
        print(content[:1000] + "..." if len(content) > 1000 else content)
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    main()