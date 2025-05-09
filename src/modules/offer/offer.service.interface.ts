import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { DatabaseRepositoryInterface } from '../../common/database.repository.interface.js';

export interface OfferServiceInterface
  extends DatabaseRepositoryInterface<OfferEntity, CreateOfferDto> {
  incCommentCount(offerId: string, newRating: number): Promise<void>;
  findPremiumByCity(city: string, limit?: number): Promise<OfferEntity[]>;
}
