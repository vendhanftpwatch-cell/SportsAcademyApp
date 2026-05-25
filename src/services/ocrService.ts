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
      const Tesseract = (await import('tesseract.js')).default;
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
  // Normalize line endings and spaces for easier regex
  const lines = text.split(/\r?\n/).map(l => l.trim());
  const joined = lines.join(' ');

  // Student Name
  let studentName = null;
  const nameLine = lines.find(l => l.match(/name.*applicant/i));
  if (nameLine) {
    const match = nameLine.match(/applicant.*?:\s*([A-Z\s]+)/i);
    if (match) studentName = match[1].replace(/[^A-Z\s]/gi, '').trim();
  }
  if (!studentName) {
    const match = joined.match(/name.*applicant.*?([A-Z][A-Z\s]+)/i);
    if (match) studentName = match[1].replace(/[^A-Z\s]/gi, '').trim();
  }

  // Sports Selected
  let sportsSelected = null;
  const sportsLine = lines.find(l => l.match(/sports.*selected/i));
  if (sportsLine) {
    // Find checked sports (look for X or tick or just the first word after the number)
    const match = sportsLine.match(/selected.*?:?\s*([A-Za-z, ]+)/i);
    if (match) sportsSelected = match[1].split(',')[0].trim();
  }
  // Fallback: look for checked sports in the form
  if (!sportsSelected) {
    const sportMatch = text.match(/Skating|Karate|Shuttle|Boxing|Yoga|Chess|Silambam|Aerobics|Carrom/i);
    if (sportMatch) sportsSelected = sportMatch[0];
  }

  // Date of Birth
  let dateOfBirth = null;
  const dobLine = lines.find(l => l.match(/date.*birth/i));
  if (dobLine) {
    const match = dobLine.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    if (match) dateOfBirth = match[1];
  }

  // Gender
  let gender = null;
  const genderLine = lines.find(l => l.match(/gender/i));
  if (genderLine) {
    const match = genderLine.match(/gender.*?:?\s*([A-Za-z]+)/i);
    if (match) gender = match[1];
  }
  if (!gender) {
    const match = joined.match(/\b(female|male|m|f)\b/i);
    if (match) gender = match[1];
  }

  // Parent's Name
  let parentName = null;
  const parentLine = lines.find(l => l.match(/parent.*name/i));
  if (parentLine) {
    const match = parentLine.match(/parent.*name.*?:?\s*([A-Z\.\s,]+)/i);
    if (match) parentName = match[1].replace(/[^A-Z\s\.,]/gi, '').trim();
  }
  if (!parentName) {
    const match = joined.match(/parent.*name.*?([A-Z][A-Z\s,\.]+)/i);
    if (match) parentName = match[1].replace(/[^A-Z\s\.,]/gi, '').trim();
  }

  // Permanent Address
  let permanentAddress = null;
  const addressLine = lines.find(l => l.match(/permanent.*address/i));
  if (addressLine) {
    const match = addressLine.match(/address.*?:?\s*([A-Z0-9\s,\-]+)/i);
    if (match) permanentAddress = match[1].trim();
  }
  if (!permanentAddress) {
    // Try to find address after parent name
    const idx = lines.findIndex(l => l.match(/parent.*name/i));
    if (idx !== -1 && lines[idx + 1]) {
      permanentAddress = lines[idx + 1].replace(/[^A-Z0-9\s,\-]/gi, '').trim();
    }
  }

  // Contact Number
  let contactNumber = null;
  const contactLine = lines.find(l => l.match(/contact|phone|mobile/i));
  if (contactLine) {
    const match = contactLine.match(/(\d{10,})/);
    if (match) contactNumber = match[1];
  }
  if (!contactNumber) {
    const match = joined.match(/(\d{10,})/);
    if (match) contactNumber = match[1];
  }

  // Date Enrolled
  let dateEnrolled = null;
  const dateLine = lines.find(l => l.match(/date/i));
  if (dateLine) {
    const match = dateLine.match(/date.*?:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
    if (match) dateEnrolled = match[1];
  }
  if (!dateEnrolled) {
    // Try to find date at the top of the form
    const match = text.match(/Date\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
    if (match) dateEnrolled = match[1];
  }

  return {
    studentName: {
      value: studentName || null,
      confidence: studentName ? 95 : 0,
      lowConfidence: !studentName
    },
    sportsSelected: {
      value: sportsSelected || null,
      confidence: sportsSelected ? 95 : 0,
      lowConfidence: !sportsSelected
    },
    dateOfBirth: {
      value: dateOfBirth ? normalizeDate(dateOfBirth) : null,
      confidence: dateOfBirth ? 95 : 0,
      lowConfidence: !dateOfBirth
    },
    gender: {
      value: gender ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase() : null,
      confidence: gender ? 95 : 0,
      lowConfidence: !gender
    },
    parentName: {
      value: parentName || null,
      confidence: parentName ? 95 : 0,
      lowConfidence: !parentName
    },
    permanentAddress: {
      value: permanentAddress || null,
      confidence: permanentAddress ? 90 : 0,
      lowConfidence: !permanentAddress
    },
    contactNumber: {
      value: contactNumber ? normalizePhoneNumber(contactNumber) : null,
      confidence: contactNumber ? 95 : 0,
      lowConfidence: !contactNumber
    },
    dateEnrolled: {
      value: dateEnrolled ? normalizeDate(dateEnrolled) : null,
      confidence: dateEnrolled ? 95 : 0,
      lowConfidence: !dateEnrolled
    }
  };
};