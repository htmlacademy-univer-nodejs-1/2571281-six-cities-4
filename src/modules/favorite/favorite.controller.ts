import { Request, Response } from 'express';
import { injectable } from 'inversify';

import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';

@injectable()
export class FavoriteController extends Controller {
  constructor() {
    super();

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/favorites/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.toggle,
    });
  }

  private async index(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async toggle(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }
}
