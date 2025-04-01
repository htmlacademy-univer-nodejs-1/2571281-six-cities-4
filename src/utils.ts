import got from 'got';
import { Offer } from './types.js';

export async function fetchOffersData(url: string): Promise<Offer[]> {
  try {
    const response = await got(url);
    const data = JSON.parse(response.body);

    if (!data.offers || !Array.isArray(data.offers)) {
      throw new Error('No offers found or the response format is invalid.');
    }

    return data.offers as Offer[];
  } catch (error) {
    console.error(`Failed to fetch offers from ${url}:`, error);
    throw error;
  }
}
