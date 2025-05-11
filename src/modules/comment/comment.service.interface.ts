import { CreateCommentDto } from './create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';
import { DocumentType } from '@typegoose/typegoose';

export interface CommentServiceInterface {
  create(
    offerId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<DocumentType<CommentEntity>>;

  findByOffer(
    offerId: string,
    limit?: number,
  ): Promise<DocumentType<CommentEntity>[]>;
}
