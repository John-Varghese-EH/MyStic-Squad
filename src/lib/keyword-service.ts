
/**
 * @fileOverview A simulated service for managing keywords for the web scanner.
 * In a real-world scenario, this would interact with a database like Firestore.
 */
import fs from 'fs/promises';


export type ScanKeyword = {
  word: string;
  weight: number;
  category: string;
};

/**
 * Fetches keywords for the web text scanner.
 * @returns {Promise<ScanKeyword[]>} A promise that resolves to an array of keywords.
 */
export async function getScanKeywords(): Promise<ScanKeyword[]> {
  // In a real application, this would fetch from Firestore or another database.
  // For this demo, we're reading from a local text file.
  console.log('Fetching keywords from local keyword file...');
  try {
    const keywordFileContent = await fs.readFile('keyword.txt', 'utf-8');
    const keywords = keywordFileContent.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(word => ({ word, weight: 5, category: 'Custom' }));
    return keywords;
  } catch (error) {
      console.error("Error reading keyword.txt:", error);
      // Return a default list or an empty list in case of an error
      return [
        { word: 'crypto', weight: 5, category: 'Finance' },
        { word: 'untraceable', weight: 8, category: 'Finance' },
        { word: 'laundering', weight: 10, category: 'Finance' },
      ];
  }
}

    