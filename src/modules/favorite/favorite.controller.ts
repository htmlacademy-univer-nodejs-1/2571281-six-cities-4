import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';
import { TYPES } from '../../types.js';

import type { FavoriteServiceInterface } from './favorite.service.interface.js';

@injectable()
export class FavoriteController extends Controller {
  constructor(
    @inject(TYPES.FavoriteService) private readonly favoriteService: FavoriteServiceInterface,
  ) {
    super();

    this.addRoute({
      path: '/favorites/:userId',
      method: HttpMethod.Get,
      handler: this.list,
      middlewares: []
    });

    this.addRoute({
      path: '/favorites/:userId/:offerId',
      method: HttpMethod.Post,
      handler: this.add,
      middlewares: []
    });

    this.addRoute({
      path: '/favorites/:userId/:offerId',
      method: HttpMethod.Delete,
      handler: this.remove,
      middlewares: []
    });
  }

  private async list(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const favorites = await this.favoriteService.findByUser(userId);

    this.ok(res, favorites);
  }

  private async add(req: Request, res: Response): Promise<void> {
    const { userId, offerId } = req.params;
    const { added } = await this.favoriteService.toggle(userId, offerId);

    if (added) {
      this.created(res, { offerId });
    } else {
      this.ok(res, { offerId });
    }
  }

  private async remove(req: Request, res: Response): Promise<void> {
    const { userId, offerId } = req.params;
    const { added } = await this.favoriteService.toggle(userId, offerId);

    if (added) {
      this.notFound(res, `Favorite for offer ${offerId} not found for user ${userId}`);
      return;
    }

    this.noContent(res);
  }
}
