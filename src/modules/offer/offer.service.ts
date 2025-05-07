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
}
