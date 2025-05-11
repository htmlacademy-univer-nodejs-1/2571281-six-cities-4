import got from 'got';
import { Offer } from './types.js';
import { getRandomItem } from './random.js';
import { createWriteStream } from 'node:fs';
import { CreateOfferDto } from './modules/offer/create-offer.dto.js';
import { City, HousingType, Good } from './modules/offer/offer.enum.js';

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
    title:         getRandomItem(offers).title,
    description:   getRandomItem(offers).description,
    postDate:      getRandomItem(offers).postDate,
    city:          getRandomItem(offers).city,
    previewImage:  getRandomItem(offers).previewImage,
    images:        getRandomItem(offers).images,
    isPremium:     getRandomItem(offers).isPremium,
    isFavorite:    getRandomItem(offers).isFavorite,
    rating:        getRandomItem(offers).rating,
    type:          getRandomItem(offers).type,
    bedrooms:      getRandomItem(offers).bedrooms,
    maxAdults:     getRandomItem(offers).maxAdults,
    price:         getRandomItem(offers).price,
    goods:         getRandomItem(offers).goods,
    host:          getRandomItem(offers).host,
    commentCount:  getRandomItem(offers).commentCount,
    coordinates:   getRandomItem(offers).coordinates
  };
}

export async function writeOffersToTSV(
  offers: Offer[],
  filePath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = createWriteStream(filePath, { encoding: 'utf-8' });

    for (const offer of offers) {
      const imagesStr = offer.images.join(',');
      const goodsStr = offer.goods.join(',');

      const safeTitle = offer.title.replace(/\t|\n/g, ' ');
      const safeDescription = offer.description.replace(/\t|\n/g, ' ');

      const lineFields = [
        safeTitle,
        safeDescription,
        offer.city,
        offer.previewImage,
        imagesStr,
        offer.isPremium.toString(),
        offer.type,
        offer.bedrooms.toString(),
        offer.maxAdults.toString(),
        offer.price.toString(),
        goodsStr,
        offer.host.name,
        offer.host.email,
        offer.coordinates.latitude.toString(),
        offer.coordinates.longitude.toString()
      ];

      ws.write(`${lineFields.join('\t')}\n`);
    }

    ws.end();
    ws.on('finish', resolve);
    ws.on('error', reject);
  });
}

export function parseOffer(line: string): CreateOfferDto {
  const tokens = line.replace(/\r?\n$/, '').split('\t');

  if (tokens.length !== 19) {
    throw new Error(
      `Malformed TSV row (${tokens.length} columns, expected 19):\n${line}`
    );
  }

  const [
    title,
    description,
    city,
    previewImage,
    images,
    isPremium,
    type,
    bedrooms,
    maxAdults,
    price,
    goods,
    /* hostName */, /* hostEmail */,
    latitude,
    longitude
  ] = tokens;

  const toBool = (v: string) => v.trim().toLowerCase() === 'true';
  const toNum = (v: string) => Number(v);
  const trimList = (v: string, sep = ',') =>
    v.split(sep).map((s) => s.trim()).filter(Boolean);

  return {
    title:        title.trim(),
    description:  description.trim(),
    city:         city.trim() as City,
    previewImage: previewImage.trim(),
    images:       trimList(images),
    isPremium:    toBool(isPremium),
    type:         type.trim() as HousingType,
    bedrooms:     toNum(bedrooms),
    maxAdults:    toNum(maxAdults),
    price:        toNum(price),
    goods:        trimList(goods).map((g) => g as Good),
    hostId:       '',
    coordinates: {
      latitude : toNum(latitude),
      longitude: toNum(longitude)
    }
  };
}
