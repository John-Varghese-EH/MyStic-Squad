import type { ThreatMessage, ThreatLevel } from './types';
import { subMinutes, subSeconds } from 'date-fns';

const keywords = {
  high: ['coke', 'heroin', 'meth', 'untraceable', 'drop point', 'kilo', 'laundering'],
  medium: ['pills', 'molly', 'acid', 'powder', 'grams', 'shipment', 'meetup', 'crypto'],
  low: ['green', 'smoke', 'edibles', 'party pack', '420', 'oz', 'delivery'],
};

const senders = Array.from({ length: 20 }, (_, i) => `user_${Math.random().toString(36).substring(2, 9)}`);

const templates = [
  'Can you supply {quantity} of {drug}? Need it by tomorrow.',
  'The package has been delivered to the usual {location}. Payment sent via {payment}.',
  'Is the new {drug} shipment in? Looking for top quality.',
  'Let\'s meet at {location}. I have the {payment}. Don\'t be late.',
  'Need something for the weekend party. Got any {drug}?',
  'The quality of the last batch of {drug} was excellent. Need more.',
];

const locations = ['spot', 'location', 'drop point', 'address'];
const payments = ['cash', 'crypto', 'wire transfer'];
const quantities = ['a few grams', 'an oz', 'a kilo', 'a small batch'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateMockMessage = (): Omit<ThreatMessage, 'id' | 'timestamp'> => {
  const levelProb = Math.random();
  const threatLevel: ThreatLevel = levelProb > 0.9 ? 'high' : levelProb > 0.6 ? 'medium' : 'low';
  
  const drug = getRandomElement(keywords[threatLevel]);
  let template = getRandomElement(templates);

  let message = template
    .replace('{quantity}', getRandomElement(quantities))
    .replace('{drug}', drug)
    .replace('{location}', getRandomElement(locations))
    .replace('{payment}', getRandomElement(payments));

  const identifiedKeywords = keywords[threatLevel].filter(kw => message.includes(kw));

  return {
    senderId: getRandomElement(senders),
    message,
    threatLevel,
    keywords: identifiedKeywords,
    patterns: ['Encrypted communication', 'Use of slang'],
    reason: `Message contains keywords related to illicit substances ('${identifiedKeywords.join("', '")}') and discusses transaction details.`,
    warrantsReview: threatLevel !== 'low',
  };
};

export const generateNewMessage = (): ThreatMessage => {
  return {
    id: Math.random().toString(36).substring(2, 15),
    timestamp: subSeconds(new Date(), Math.floor(Math.random() * 30)),
    ...generateMockMessage(),
  };
};

export const generateInitialMessages = (count = 50): ThreatMessage[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: Math.random().toString(36).substring(2, 15),
    timestamp: subMinutes(new Date(), i * 5 + Math.random() * 5),
    ...generateMockMessage(),
  }));
};
