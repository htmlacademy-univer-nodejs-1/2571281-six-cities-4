import got from 'got';
import { Offer } from './types.js';
import { getRandomItem } from './random.js';
import { createWriteStream } from 'node:fs';

export async function fetchOffersData(url: string): Promise<Offer[]> {
  try {
    const response = await got(url);
    const offers = JSON.parse(response.body);
    if (!Array.isArray(offers)) {
      throw new Error('Data returned from server is not an array.');
    }
    return offers as Offer[];
  } catch (error) {
    console.error(`Failed to fetch offers from ${url}:`, error);
    throw error;
  }
}

export function createMixedOffer(offers: Offer[]): Offer {
  return {
    title: getRandomItem(offers).title,
    description: getRandomItem(offers).description,
    postedDate: getRandomItem(offers).postedDate,
    city: getRandomItem(offers).city,
    previewImage: getRandomItem(offers).previewImage,
    isPremium: getRandomItem(offers).isPremium,
    isFavorite: getRandomItem(offers).isFavorite,
    rating: getRandomItem(offers).rating,
    type: getRandomItem(offers).type,
    roomsCount: getRandomItem(offers).roomsCount,
    guestsCount: getRandomItem(offers).guestsCount,
    price: getRandomItem(offers).price,
    commentsCount: getRandomItem(offers).commentsCount,

    images: getRandomItem(offers).images,
    amenities: getRandomItem(offers).amenities,

    author: getRandomItem(offers).author,

    location: getRandomItem(offers).location
  };
}

export async function writeOffersToTSV(offers: Offer[], filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {

    const writeStream = createWriteStream(filePath, { encoding: 'utf-8' });

    for (const offer of offers) {
      const imagesStr = offer.images.join(',');
      const amenitiesStr = offer.amenities.join(',');

      const safeTitle = offer.title.replace(/\t|\n/g, ' ');
      const safeDescription = offer.description.replace(/\t|\n/g, ' ');

      const lineFields = [
        safeTitle,
        safeDescription,
        offer.postedDate.toString(),
        offer.city,
        offer.previewImage,
        imagesStr,
        offer.isPremium.toString(),
        offer.isFavorite.toString(),
        offer.rating.toString(),
        offer.type,
        offer.roomsCount.toString(),
        offer.guestsCount.toString(),
        offer.price.toString(),
        amenitiesStr,
        offer.author.name,
        offer.author.email,
        offer.commentsCount.toString(),
        offer.location.latitude.toString(),
        offer.location.longitude.toString()
      ];

      const line = lineFields.join('\t');
      writeStream.write(`${line }\n`);
    }

    writeStream.end();

    writeStream.on('finish', () => resolve());
    writeStream.on('error', (error) => reject(error));
  });
}
