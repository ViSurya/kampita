import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const htmlEntities: Record<string, string> = {
  '&quot;': '"',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&apos;': "'",
  // Add more entities as needed
};

export const decodeHtmlEntities = (text: string): string => {
  return text.replace(/&quot;|&amp;|&lt;|&gt;|&apos;/g, match => htmlEntities[match]);
};

export const decodeHtmlEntitiesInJson = (obj: any): any => {
  if (typeof obj === 'string') {
    return decodeHtmlEntities(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(decodeHtmlEntitiesInJson);
  } else if (obj !== null && typeof obj === 'object') {
    const decodedObj: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Check if the property is a URL that starts with "www.jiosaavn.com"
        if (typeof obj[key] === 'string' && obj[key].startsWith("https://www.jiosaavn.com")) {
          continue; // Skip this URL property
        }
        decodedObj[key] = decodeHtmlEntitiesInJson(obj[key]);
      }
    }
    return decodedObj;
  }
  return obj;
};



export function formatDuration(durationInSeconds: number): string {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}