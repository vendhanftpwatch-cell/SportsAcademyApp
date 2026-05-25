import Tesseract from 'tesseract.js';

export interface ExtractedField {
  value: string | null;
  confidence: number;
  lowConfidence: boolean;
}

export interface OcrStudentData {
  studentName: ExtractedField;
  sportsSelected: ExtractedField;
  dateOfBirth: ExtractedField;
  gender: ExtractedField;
  parentName: ExtractedField;
  permanentAddress: ExtractedField;
  contactNumber: ExtractedField;
  dateEnrolled: ExtractedField;
}

const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (digits.length === 11 && digits.startsWith('0')) {
    return `+91 ${digits.slice(1, 6)} ${digits.slice(6)}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return phone.trim();
};

const normalizeDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const patterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,
    /(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})/,
  ];
  for (const pattern of patterns) {
    const match = dateStr.match(pattern);
    if (match) {
      let day, month, year;
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      if (pattern.source.includes('A-Za-z')) {
        day = match[1].padStart(2, '0');
        month = String(monthNames.indexOf(match[2].toLowerCase().slice(0, 3)) + 1).padStart(2, '0');
        year = match[3];
      } else if (match[1].length === 4) {
        year = match[1];
        month = match[2].padStart(2, '0');
        day = match[3].padStart(2, '0');
      } else {
        day = match[1].padStart(2, '0');
        month = match[2].padStart(2, '0');
        year = match[3].length === 2 ? `20${match[3]}` : match[3];
      }
      return `${year}-${month}-${day}`;
    }
  }
  return dateStr;
};

const convertPdfToImages = async (file: File): Promise<File[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
  const loadingTask: any = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;
  const images: File[] = [];
  
  for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
    const page: any = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const renderContext = { canvasContext: context, viewport };
    const renderTask = page.render(renderContext);
    await renderTask.promise;
    const blob = await new Promise<Blob>((resolve) => canvas.toBlob(resolve as any, 'image/png') as any);
    images.push(new File([blob], `page-${i}.png`, { type: 'image/png' }));
  }
  return images;
};

export const processImageOcr = async (file: File): Promise<OcrStudentData> => {
  let imageFiles: File[] = [file];
  if (file.type === 'application/pdf') {
    imageFiles = await convertPdfToImages(file);
  }
  
  let bestResult: OcrStudentData | null = null;
  
  for (const imageFile of imageFiles) {
    const imageUrl = URL.createObjectURL(imageFile);
    try {
      const result = await Tesseract.recognize(imageUrl, 'eng', {
        logger: (m) => console.log(m),
      });
      const text = result.data.text;
      const extractedData = extractDataFromText(text);
      
      if (!bestResult || getFilledFields(extractedData) > getFilledFields(bestResult)) {
        bestResult = extractedData;
      }
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }
  
  return bestResult || extractDataFromText('');
};

const getFilledFields = (data: OcrStudentData): number => {
  return Object.values(data).filter(f => f.value !== null).length;
};

const extractDataFromText = (text: string): OcrStudentData => {
  const normalizedText = text.replace(/\s+/g, ' ');

  const studentNameMatch = normalizedText.match(/(?:student\s*name|name)\s*[:\\-]?\\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  const studentName: ExtractedField = studentNameMatch 
    ? { value: studentNameMatch[1].trim(), confidence: 90, lowConfidence: false }
    : { value: null, confidence: 0, lowConfidence: true };

  const sportsMatch = normalizedText.match(/(?:sports?\s*selected?|sport)\s*[:\\-]?\\s*([A-Za-z\s\/\\&]+)/i);
  const sportsSelected: ExtractedField = sportsMatch 
    ? { value: sportsMatch[1].trim(), confidence: 85, lowConfidence: false }
    : { value: null, confidence: 0, lowConfidence: true };

  const dobMatch = normalizedText.match(/(?:date\s*of\s*birth|dob|birth\s*date)\s*[:\\-]?\\s*([\d\/\-\.]+)/i);
  const dateOfBirth: ExtractedField = dobMatch 
    ? { value: normalizeDate(dobMatch[1].trim()), confidence: 85, lowConfidence: false }
    : { value: null, confidence: 0, lowConfidence: true };

  const genderMatch = normalizedText.match(/(?:gender|sex)\s*[:\\-]?\\s*(male|female|other|m|f)/i);
  const gender: ExtractedField = genderMatch 
    ? { value: genderMatch[1].charAt(0).toUpperCase() + genderMatch[1].slice(1).toLowerCase(), confidence: 90, lowConfidence: false }
    : { value: null, confidence: 0, lowConfidence: true };

  const parentMatch = normalizedText.match(/(?:parent['']?\s*name|father['']?\s*name|guardian)\s*[:\\-]?\\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
  const parentName: ExtractedField = parentMatch 
    ? { value: parentMatch[1].trim(), confidence: 85, lowConfidence: false }
    : { value: null, confidence: 0, lowConfidence: true };

  const addressMatch = normalizedText.match(/(?:permanent\s*address|address)\s*[:\\-]?\\s*([\d\sA-Za-z\,\.]+)/i);
  const permanentAddress: ExtractedField = addressMatch 
    ? { value: addressMatch[1].trim(), confidence: 80, lowConfidence: false }
    : { value: null, confidence: 0, lowConfidence: true };

  const phoneMatch = normalizedText.match(/(?:contact\s*no?|phone|mobile|number)\s*[:\\-]?\\s*([\d\s\+]+)/i);
  const contactNumber: ExtractedField = phoneMatch 
    ? { value: normalizePhoneNumber(phoneMatch[1]), confidence: 85, lowConfidence: false }
    : { value: null, confidence: 0, lowConfidence: true };

  const enrolledMatch = normalizedText.match(/(?:date\s*enrolled|enrollment\s*date|joined\s*date)\s*[:\\-]?\\s*([\d\/\-\.]+)/i);
  const dateEnrolled: ExtractedField = enrolledMatch 
    ? { value: normalizeDate(enrolledMatch[1].trim()), confidence: 85, lowConfidence: false }
    : { value: null, confidence: 0, lowConfidence: true };

  return {
    studentName,
    sportsSelected,
    dateOfBirth,
    gender,
    parentName,
    permanentAddress,
    contactNumber,
    dateEnrolled,
  };
};