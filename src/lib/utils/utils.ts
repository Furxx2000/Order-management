import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fuzzyMatch(query: string, text: string) {
  if (!query) return true;
  if (query.length > text.length) return false;

  const q = query.toLowerCase();
  const t = text.toLowerCase();

  let qIdx = 0;
  let tIdx = 0;

  while (qIdx < q.length && tIdx < t.length) {
    if (q[qIdx] === t[tIdx]) {
      qIdx++;
    }
    tIdx++;
  }

  return qIdx === q.length;
}
