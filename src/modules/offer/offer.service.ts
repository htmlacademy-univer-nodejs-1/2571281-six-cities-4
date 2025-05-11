import { injectable, inject } from 'inversify';
import { OfferServiceInterface } from './offer.service.interface.js';
import { TYPES } from '../../types.js';
import { LoggerInterface } from '../../libs/logger.interface.js';
import { OfferEntity, OfferModel } from './index.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { Types } from 'mongoose';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.OfferModel) private readonly offerModel: typeof OfferModel,
  ) {}

  public async create(dto: CreateOfferDto): Promise<OfferEntity> {
    const offer = await this.offerModel.create({
      ...dto,
      host: new Types.ObjectId(dto.hostId),
    });
    this.logger.info(`[Offer] created: ${offer.id}`);
    return offer;
  }

  public findById(id: string): Promise<OfferEntity | null> {
    return this.offerModel.findById(id).exec();
  }

  public async incCommentCount(
    offerId: string,
    newRating: number,
  ): Promise<void> {
    const offer = await this.offerModel.findById(offerId);
    if (!offer) {
      return;
    }

    const total = offer.rating * offer.commentCount + newRating;
    const count = offer.commentCount + 1;

    offer.rating = Number((total / count).toFixed(1));
    offer.commentCount = count;
    await offer.save();
  }

  public async findPremiumByCity(
    city: string,
    limit = 10,
  ): Promise<OfferEntity[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  public async list(limit?: number): Promise<OfferEntity[]> {
    const query = this.offerModel.find().sort({ createdAt: -1 });
    if (limit) {
      query.limit(limit);
    }
    return query.exec();
  }

  public async updateById(
    id: string,
    dto: Partial<CreateOfferDto>,
  ): Promise<OfferEntity | null> {
    return this.offerModel
      .findByIdAndUpdate(id, dto, { new: true, lean: true })
      .exec();
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.offerModel.deleteOne({ _id: id }).exec();
    return result.deletedCount === 1;
  }
}
