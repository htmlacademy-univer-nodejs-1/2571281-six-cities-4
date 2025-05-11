import { City, HousingType, Good } from './modules/offer/offer.enum.js';

export type UserType = 'usual' | 'pro';

export const TYPES = {
  Application: Symbol.for('Application'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService : Symbol.for('UserService'),
  OfferService: Symbol.for('OfferService'),
  UserModel      : Symbol.for('UserModel'),
  OfferModel     : Symbol.for('OfferModel'),
  CommentService : Symbol.for('CommentService'),
  CommentModel   : Symbol.for('CommentModel'),
  FavoriteService : Symbol.for('FavoriteService'),
  FavoriteModel   : Symbol.for('FavoriteModel'),
  AuthController : Symbol.for('AuthController'),
  ExceptionFilter : Symbol.for('ExceptionFilter')
};

export interface User {
  name: string;
  email: string;
  avatarPath?: string;
  password: string;
  userType: UserType;
}

export interface Offer {
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
  host: User;
  commentCount: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}


export interface Comment {
  text: string;
  createdAt: Date;
  rating: number;
  user: User;
}
