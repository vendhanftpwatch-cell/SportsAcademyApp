declare module 'pdfjs-dist/build/pdf.mjs' {
  export interface PDFPageViewport {
    width: number;
    height: number;
  }
  export interface PDFPageProxy {
    getViewport(options: { scale: number }): PDFPageViewport;
    render(renderContext: { canvasContext: CanvasRenderingContext2D; viewport: PDFPageViewport }): { promise: Promise<void> };
  }
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }
  export interface PDFLoadingTask {
    promise: Promise<PDFDocumentProxy>;
  }
  export function getDocument(options: { data: Uint8Array }): PDFLoadingTask;
}
declare module 'pdfjs-dist' {
  export { getDocument } from 'pdfjs-dist/build/pdf.mjs';
}

interface ImportMeta {
  readonly env: Record<string, string>;
}