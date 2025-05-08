import { City, HousingType, Good } from './offer.enum.js';

export type CreateOfferDto = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Good[];
  host: string;
  coordinates: { latitude: number; longitude: number };
};
