import { inject, injectable } from 'inversify';
import { Types } from 'mongoose';
import { LoggerInterface } from '../../libs/logger.interface.js';
import { TYPES } from '../../types.js';
import { CommentServiceInterface } from './comment.service.interface.js';
import { CommentModel } from './comment.entity.js';
import { CreateCommentDto } from './create-comment.dto.js';
import { OfferServiceInterface } from '../offer/offer.service.interface.js';

@injectable()
export class CommentService implements CommentServiceInterface {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.CommentModel) private readonly commentModel: typeof CommentModel,
    @inject(TYPES.OfferService) private readonly offerService: OfferServiceInterface,
  ) {}

  public async create(offerId: string, userId: string, dto: CreateCommentDto) {
    const comment = await this.commentModel.create({
      ...dto,
      offer: new Types.ObjectId(offerId),
      user:  new Types.ObjectId(userId),
    });

    await this.offerService.incCommentCount(offerId, comment.rating);

    this.logger.info(`[Comment] created ${comment.id} by user ${userId}`);
    return comment;
  }


  public findByOffer(offerId: string, limit = 50) {
    return this.commentModel
      .find({ offer: offerId })
      .populate('user')
      .sort({ postDate: -1 })
      .limit(limit)
      .exec();
  }

  public async deleteByOffer(offerId: string): Promise<number> {
    const { deletedCount = 0 } = await this.commentModel.deleteMany({ offer: offerId });
    this.logger.info(`[Comment] deleted ${deletedCount} comments for offer ${offerId}`);
    return deletedCount;
  }
}
