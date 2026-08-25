import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
if (typeof window !== 'undefined') {
  // Use unpkg or cdnjs worker corresponding to standard build
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Extract text content from a PDF File or ArrayBuffer
 */
export const extractTextFromPdf = async (
  fileOrBuffer: File | ArrayBuffer,
  onProgress?: (current: number, total: number) => void
): Promise<{ text: string; pageCount: number; info?: any }> => {
  try {
    let arrayBuffer: ArrayBuffer;
    if (fileOrBuffer instanceof File) {
      arrayBuffer = await fileOrBuffer.arrayBuffer();
    } else {
      arrayBuffer = fileOrBuffer;
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (onProgress) {
        onProgress(pageNum, numPages);
      }
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (pageText) {
        fullText += `\n--- [ページ ${pageNum} / ${numPages}] ---\n${pageText}\n`;
      }
    }

    // Try to get metadata
    let metadata: any = null;
    try {
      metadata = await pdfDoc.getMetadata();
    } catch {
      // ignore
    }

    return {
      text: fullText.trim(),
      pageCount: numPages,
      info: metadata?.info,
    };
  } catch (error: any) {
    console.error('PDF text extraction error:', error);
    throw new Error(
      `PDFのテキスト解析に失敗しました: ${error?.message || '不明なエラー'}。スキャン画像のみのPDF（OCR未処理）やパスワード付きPDFでないかご確認ください。`
    );
  }
};

/**
 * Read text content from general text-based files (txt, md, json, csv, etc.)
 */
export const readTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.onerror = () => {
      reject(new Error('ファイルの読み込みに失敗しました。'));
    };
    reader.readAsText(file, 'UTF-8');
  });
};
