import { injectable, inject } from 'inversify';
import { OfferServiceInterface } from './offer.service.interface.js';
import { TYPES } from '../../types.js';
import { LoggerInterface } from '../../libs/logger.interface.js';
import { OfferEntity, OfferModel } from './index.js';
import { CreateOfferDto } from './create-offer.dto.js';

@injectable()
export class OfferService implements OfferServiceInterface {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.OfferModel) private readonly offerModel: typeof OfferModel,
  ) {}

  public async create(dto: CreateOfferDto): Promise<OfferEntity> {
    const offer = await this.offerModel.create(dto);
    this.logger.info(`[Offer] created: ${offer.id}`);
    return offer;
  }

  public findById(id: string): Promise<OfferEntity | null> {
    return this.offerModel.findById(id).exec();
  }

  public async incCommentCount(offerId: string, newRating: number): Promise<void> {
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

  public async findPremiumByCity(city: string, limit = 10): Promise<OfferEntity[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
