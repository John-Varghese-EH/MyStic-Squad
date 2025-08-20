
/**
 * @fileOverview A simulated service for managing keywords for the web scanner.
 * In a real-world scenario, this would interact with a database like Firestore.
 */

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
  // For this demo, we're returning a static list.
  console.log('Fetching keywords from simulated keyword service...');
  return Promise.resolve([
    // Financial keywords
    { word: 'crypto', weight: 5, category: 'Finance' },
    { word: 'untraceable', weight: 8, category: 'Finance' },
    { word: 'laundering', weight: 10, category: 'Finance' },
    { word: 'payment', weight: 3, category: 'Finance' },
    { word: 'transfer', weight: 3, category: 'Finance' },
    { word: 'offshore', weight: 7, category: 'Finance' },

    // Drug-related keywords
    { word: 'pills', weight: 4, category: 'Drugs' },
    { word: 'powder', weight: 4, category: 'Drugs' },
    { word: 'shipment', weight: 6, category: 'Drugs' },
    { word: 'kilo', weight: 9, category: 'Drugs' },
    { word: 'grams', weight: 3, category: 'Drugs' },
    { word: 'vendor', weight: 5, category: 'Drugs' },

    // Hacking/Cybercrime keywords
    { word: 'malware', weight: 8, category: 'Cybercrime' },
    { word: 'phishing', weight: 7, category: 'Cybercrime' },
    { word: 'darknet', weight: 10, category: 'Cybercrime' },
    { word: 'exploit', weight: 9, category: 'Cybercrime' },
    { word: 'botnet', weight: 9, category: 'Cybercrime' },
  ]);
}
