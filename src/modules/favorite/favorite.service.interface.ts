import { FavoriteEntity } from './favorite.entity.js';

export interface FavoriteServiceInterface {
  toggle(userId: string, offerId: string): Promise<{ added: boolean }>;
  findByUser(userId: string, limit?: number): Promise<FavoriteEntity[]>;
}
