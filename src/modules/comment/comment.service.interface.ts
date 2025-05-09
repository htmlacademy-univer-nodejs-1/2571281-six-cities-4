import { CreateCommentDto } from './create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto, userId: string, offerId: string): Promise<CommentEntity>;
  findByOffer(offerId: string, limit?: number): Promise<CommentEntity[]>;
}
