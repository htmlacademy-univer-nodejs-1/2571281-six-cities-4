import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';
import { TYPES } from '../../types.js';
import { CommentServiceInterface } from './comment.service.interface.js';
import { CreateCommentDto } from './create-comment.dto.js';

@injectable()
export class CommentController extends Controller {
  constructor(
    @inject(TYPES.CommentService)
    private readonly commentService: CommentServiceInterface,
  ) {
    super();

    this.addRoute({
      path: '/offers/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/offers/:offerId/comments/:userId',
      method: HttpMethod.Post,
      handler: this.create,
    });
  }

  private async index(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const comments = await this.commentService.findByOffer(offerId);
    this.ok(res, comments);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const { offerId, userId } = req.params;
    const dto = req.body as CreateCommentDto;

    const comment = await this.commentService.create(offerId, userId, dto);
    this.created(res, comment);
  }
}

