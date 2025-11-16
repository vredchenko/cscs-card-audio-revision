import type { RevisionContent } from '../types';

/**
 * Load revision content from JSON file
 */
export async function loadRevisionContent(path: string = 'data/cscs-questions.json'): Promise<RevisionContent> {
  try {
    // Construct the full path using Vite's base URL
    const baseUrl = import.meta.env.BASE_URL;
    const fullPath = `${baseUrl}${path}`;

    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.statusText}`);
    }
    const data = await response.json();
    return data as RevisionContent;
  } catch (error) {
    console.error('Error loading revision content:', error);
    throw error;
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
