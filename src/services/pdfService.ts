import * as pdfjsLib from 'pdfjs-dist';

// Set worker path from cdnjs or local build for browser execution
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromFile(file: File): Promise<{ text: string; fileName: string; totalPages: number }> {
  const fileName = file.name;

  // Plain Text file handler
  if (file.type === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    const text = await file.text();
    return { text, fileName, totalPages: 1 };
  }

  // PDF file handler
  if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= Math.min(numPages, 25); i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      return {
        text: fullText.trim(),
        fileName,
        totalPages: numPages
      };
    } catch (err) {
      console.error("PDF Parsing error:", err);
      throw new Error("Failed to parse PDF document. Please copy and paste the text manually into the box below.");
    }
  }

  throw new Error("Unsupported file format. Please upload a .pdf or .txt file.");
}
