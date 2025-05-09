import { Request, Response } from 'express';
import { injectable } from 'inversify';

import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';

@injectable()
export class OfferController extends Controller {
  constructor() {
    super();

    this.addRoute({ path: '/offers', method: HttpMethod.Get, handler: this.index });

    this.addRoute({ path: '/offers/:offerId', method: HttpMethod.Get, handler: this.show });

    this.addRoute({ path: '/offers', method: HttpMethod.Post, handler: this.create });

    this.addRoute({ path: '/offers/:offerId', method: HttpMethod.Put, handler: this.update });

    this.addRoute({ path: '/offers/:offerId', method: HttpMethod.Delete, handler: this.remove });

    this.addRoute({ path: '/offers/premium', method: HttpMethod.Get, handler: this.premium });

    this.addRoute({ path: '/offers/favorite', method: HttpMethod.Get, handler: this.favorites });
  }

  private async index(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async show(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async create(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async update(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async remove(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async premium(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async favorites(_: Request, res: Response): Promise<void>{
    this.notImplemented(res);
  }
}
