import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';
import { TYPES } from '../../types.js';

import { OfferServiceInterface } from './offer.service.interface.js';
import { CreateOfferDto } from './create-offer.dto.js';
import { HttpError } from '../../common/errors/http-error.js';
import { validateObjectId } from '../../app/middleware/validate-objectid.middleware.js';
import { validateDto } from '../../app/middleware/validate-dto.middleware.js';
import { checkExists } from '../../app/middleware/check-exists.middleware.js';
import { CommentServiceInterface } from '../comment/comment.service.interface.js';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(TYPES.OfferService)
    private readonly offerService: OfferServiceInterface,
    @inject(TYPES.CommentService)
    private readonly commentService: CommentServiceInterface,
  ) {
    super();

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: []
    });
    this.addRoute({
      path: '/offers',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [validateDto(CreateOfferDto)]
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [validateObjectId('offerId'), checkExists('offerId', this.offerService, 'Offer'), ]
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [validateObjectId('offerId'), checkExists('offerId', this.offerService, 'Offer'), ]
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [validateObjectId('offerId'), checkExists('offerId', this.offerService, 'Offer'), ]
    });

    this.addRoute({
      path: '/cities/:city/offers/premium',
      method: HttpMethod.Get,
      handler: this.cityPremium,
      middlewares: []
    });
  }

  private async index(
    { query }: Request<unknown, unknown, unknown, { limit?: string }>,
    res: Response,
  ): Promise<void> {
    const limit = query.limit ? Number(query.limit) : 60;
    const offers = await this.offerService.list(limit);
    this.ok(res, offers);
  }

  private async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(404, 'Offer not found', { offerId });
    }
    this.ok(res, offer);
  }

  private async create(
    { body }: Request<unknown, unknown, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const newOffer = await this.offerService.create(body);
    this.created(res, newOffer);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const updated = await this.offerService.updateById(offerId, req.body);
    this.ok(res, updated);
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    await this.offerService.deleteById(offerId);
    this.commentService.deleteByOffer(offerId);
    this.noContent(res);
  }

  private async cityPremium(req: Request, res: Response): Promise<void> {
    const { city } = req.params as { city: string };
    const premium = await this.offerService.findPremiumByCity(city);
    if (!premium.length) {
      throw new HttpError(404, 'City not found or no premium offers', { city });
    }
    this.ok(res, premium);
  }
}
