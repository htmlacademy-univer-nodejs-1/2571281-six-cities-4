import { inject, injectable } from 'inversify';
import { TYPES } from '../../types.js';
import type { LoggerInterface } from '../../libs/logger.interface.js';
import { CommentModel, CommentEntity } from './index.js';
import { CreateCommentDto } from './create-comment.dto.js';
import type { OfferServiceInterface } from '../offer/offer.service.interface.js';
import { CommentServiceInterface } from './comment.service.interface.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.CommentModel) private readonly commentModel: typeof CommentModel,
    @inject(TYPES.OfferService) private readonly offerService: OfferServiceInterface,
  ) {}

  public async create(dto: CreateCommentDto, userId: string, offerId: string): Promise<CommentEntity> {
    const comment = await this.commentModel.create({ ...dto, author: userId, offer: offerId });

    await this.offerService.incCommentCount(offerId, comment.rating);

    this.logger.info(`[Comment] created: ${comment.id}`);
    return comment;
  }

  public findByOffer(offerId: string, limit = 50): Promise<CommentEntity[]> {
    return this.commentModel
      .find({ offer: offerId })
      .populate('author', ['name', 'avatarUrl', 'type'])
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
