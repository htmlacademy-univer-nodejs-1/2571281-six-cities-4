export type UserType = 'usual' | 'pro';

export const TYPES = {
  Logger: Symbol.for('Logger'),
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
  postedDate: Date;
  city: string;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: 'apartment' | 'house' | 'room' | 'hotel';
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: string[];
  author: User;
  commentsCount: number;
  location: {
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
