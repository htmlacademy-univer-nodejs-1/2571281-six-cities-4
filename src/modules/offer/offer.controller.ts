// src/modules/offer/offer.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';
import { TYPES } from '../../types.js';

import { OfferServiceInterface } from './offer.service.interface.js';
import { CreateOfferDto } from './create-offer.dto.js';

@injectable()
export class OfferController extends Controller {
  constructor(
    @inject(TYPES.OfferService)
    private readonly offerService: OfferServiceInterface,
  ) {
    super();

    this.addRoute({
      path: '/offers',
      method: HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: '/offers',
      method: HttpMethod.Post,
      handler: this.create,
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
    });
    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });

    this.addRoute({
      path: '/cities/:city/offers/premium',
      method: HttpMethod.Get,
      handler: this.cityPremium,
    });
  }

  private async index(
    { query }: Request<unknown, unknown, unknown, { limit?: string }>,
    res: Response,
  ): Promise<void> {
    const limit = query.limit ? Number(query.limit) : undefined;
    const offers = await this.offerService.list(limit);
    this.ok(res, offers);
  }

  private async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      return this.notFound(res, 'Offer not found');
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
    if (!updated) {
      return this.notFound(res, 'Offer not found');
    }
    this.ok(res, updated);
  }

  private async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params as { offerId: string };
    const removed = await this.offerService.deleteById(offerId);
    if (!removed) {
      return this.notFound(res, 'Offer not found');
    }
    this.noContent(res);
  }

  private async cityPremium(req: Request, res: Response): Promise<void> {
    const { city } = req.params as { city: string };
    const premium = await this.offerService.findPremiumByCity(city);
    if (!premium.length) {
      return this.notFound(res, 'City not found or no premium offers');
    }
    this.ok(res, premium);
  }
}
