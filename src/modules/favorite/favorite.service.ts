import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { TYPES } from '../../types.js';
import type { LoggerInterface } from '../../libs/logger.interface.js';
import { FavoriteModel, FavoriteEntity } from './index.js';
import type { FavoriteServiceInterface } from './favorite.service.interface.js';

@injectable()
export class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.FavoriteModel) private readonly favoriteModel: typeof FavoriteModel
  ) {}

  public async toggle(userId: string, offerId: string): Promise<{ added: boolean }> {
    const query = { user: new Types.ObjectId(userId), offer: new Types.ObjectId(offerId) };

    const existing = await this.favoriteModel.findOne(query).exec();
    if (existing) {
      await existing.deleteOne();
      this.logger.info(`[Favorite] removed offer ${offerId} for user ${userId}`);
      return { added: false };
    }

    await this.favoriteModel.create(query);
    this.logger.info(`[Favorite] added offer ${offerId} for user ${userId}`);
    return { added: true };
  }

  public findByUser(userId: string, limit = 60): Promise<FavoriteEntity[]> {
    return this.favoriteModel
      .find({ user: userId })
      .populate('offer')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
