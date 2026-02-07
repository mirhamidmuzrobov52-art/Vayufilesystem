
export const MAGIC_HEADER = "VAYU_SECURE_v5::";

export interface Asset {
  id: string;
  type: 'text' | 'image' | 'video';
  name: string;
  content?: string;
  dataUrl?: string; 
  objectFit?: 'cover' | 'contain' | 'fill'; // cover=Fill, contain=Fit, fill=Stretch
}

export interface FilePackage {
  meta: {
    name: string;
    ext: string;
    author?: string;
    description?: string;
    timestamp: number;
    version: string;
  };
  data: Asset[];
}

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createPackage = (
  fileName: string, 
  extension: string, 
  assets: Asset[], 
  author?: string,
  description?: string
): Blob => {
  const cleanFileName = fileName.trim().replace(/[^a-zA-Z0-9_-]/g, '') || 'Project';
  const cleanExtension = extension.trim().replace(/[^a-zA-Z0-9]/g, '') || 'vayu';

  const packageData: FilePackage = {
    meta: {
      name: cleanFileName,
      ext: cleanExtension,
      author: author || 'Anonymous Creator',
      description: description || 'Universal Binary Archive',
      timestamp: Date.now(),
      version: "5.0"
    },
    data: assets
  };

  const jsonString = JSON.stringify(packageData);
  const encodedData = MAGIC_HEADER + btoa(unescape(encodeURIComponent(jsonString)));
  return new Blob([encodedData], { type: 'application/octet-stream' });
};

export const parsePackage = (rawContent: string): FilePackage => {
  if (!rawContent.startsWith(MAGIC_HEADER)) {
    throw new Error("Invalid Format. This file was not created by Vayu.");
  }
  const base64Data = rawContent.replace(MAGIC_HEADER, "");
  const decodedJson = decodeURIComponent(escape(atob(base64Data)));
  return JSON.parse(decodedJson) as FilePackage;
};
