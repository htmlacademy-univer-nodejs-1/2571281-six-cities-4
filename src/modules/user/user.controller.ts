import { Request, Response } from 'express';
import { injectable } from 'inversify';

import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';

@injectable()
export class UserController extends Controller {
  constructor() {
    super();

    this.addRoute({
      path: '/users/register',
      method: HttpMethod.Post,
      handler: this.register,
    });

    this.addRoute({
      path: '/users/login',
      method: HttpMethod.Post,
      handler: this.login,
    });

    this.addRoute({
      path: '/users/:userId',
      method: HttpMethod.Get,
      handler: this.show,
    });
  }

  private async register(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async login(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }

  private async show(_: Request, res: Response): Promise<void> {
    this.notImplemented(res);
  }
}
