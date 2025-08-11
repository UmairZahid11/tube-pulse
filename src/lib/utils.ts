import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchTranscriptFromURL(url: string) {
  const res = await fetch(url);
  const text = await res.text(); // jsonl = text file
  const lines = text.trim().split("\n");

  const transcriptItems = lines.map((line) => JSON.parse(line));
  const fullTranscript = transcriptItems.map((item) => item.text).join(" ");

  return fullTranscript;
}

export const fetchTranscript = async (transcriptUrl: string) => {
  const res = await fetch(transcriptUrl);
  const rawText = await res.text();
  const lines = rawText
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  return lines;
};


export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) return reject('No file provided');

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('Failed to convert file');
      }
    };

    reader.onerror = error => reject(error);
  });
}

export function calculateIQR(values: number[]) {

  const sorted = [...values].sort((a, b) => a - b);

  const q1 = sorted[Math.floor(sorted.length / 4)];

  const q3 = sorted[Math.floor((sorted.length * 3) / 4)];

  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;

  const upperBound = q3 + 1.5 * iqr;

  return { q1, q3, iqr, lowerBound, upperBound };

}