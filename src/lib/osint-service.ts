/**
 * @fileOverview A simulated OSINT service for fetching suspicious keywords.
 * In a real-world scenario, this service would scrape or query external OSINT sources.
 */

export type ThreatKeywords = {
  high: string[];
  medium: string[];
  low: string[];
};

/**
 * Fetches suspicious keywords from a simulated OSINT source.
 * @returns {Promise<ThreatKeywords>} A promise that resolves to an object containing high, medium, and low risk keywords.
 */
export async function getSuspiciousKeywords(): Promise<ThreatKeywords> {
  // In a real application, this would involve web scraping or API calls to OSINT sources.
  // For this demo, we're returning a static list to simulate the functionality.
  console.log('Fetching keywords from simulated OSINT source...');
  return Promise.resolve({
    high: ['coke', 'heroin', 'meth', 'untraceable', 'kilo', 'laundering', 'darknet', 'trafficking'],
    medium: ['pills', 'molly', 'acid', 'powder', 'grams', 'shipment', 'meetup', 'crypto', 'burner phone'],
    low: ['green', 'smoke', 'edibles', 'party pack', '420', 'oz', 'delivery', 'drop', 'vendor'],
  });
}
