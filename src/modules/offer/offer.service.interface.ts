import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { DatabaseRepositoryInterface } from '../../common/database.repository.interface.js';

export interface OfferServiceInterface
  extends DatabaseRepositoryInterface<OfferEntity, CreateOfferDto> {
    create(dto: CreateOfferDto): Promise<OfferEntity>;
    findById(id: string): Promise<OfferEntity | null>;
    list(limit?: number): Promise<OfferEntity[]>;
    updateById(id: string, dto: Partial<CreateOfferDto>): Promise<OfferEntity | null>;
    deleteById(id: string): Promise<boolean>;
    incCommentCount(offerId: string, newRating: number): Promise<void>;
    findPremiumByCity(city: string, limit?: number): Promise<OfferEntity[]>;
}
