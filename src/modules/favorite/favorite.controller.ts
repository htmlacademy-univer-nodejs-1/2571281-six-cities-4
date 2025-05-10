import { Request, Response } from 'express';
import { injectable } from 'inversify';

import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';

@injectable()
export class FavoriteController extends Controller {
  constructor() {
    super();

    this.addRoute({
      path: '/favorites/:userId',
      method: HttpMethod.Get,
      handler: this.list,
    });

    this.addRoute({
      path: '/favorites/:userId/:offerId',
      method: HttpMethod.Post,
      handler: this.add,
    });

    this.addRoute({
      path: '/favorites/:userId/:offerId',
      method: HttpMethod.Delete,
      handler: this.remove,
    });
  }

  private async list(_: Request, res: Response): Promise<void> {
    // List all favorites of a given user id
    this.notImplemented(res);
  }

  private async add(_: Request, res: Response): Promise<void> {
    // Add an offer with a given id to a user with a given id favorite
    this.notImplemented(res);
  }

  private async remove(_: Request, res: Response): Promise<void> {
    // Remove an offer with a given id from a user with a given id favorite
    this.notImplemented(res);
  }
}
