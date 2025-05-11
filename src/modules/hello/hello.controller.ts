import { Request, Response, NextFunction } from 'express';
import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';

export class HelloController extends Controller {
  constructor() {
    super();

    this.addRoute({
      path: '/hello',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: []
    });
  }

  private index(_req: Request, res: Response, _next: NextFunction): void {
    this.ok(res, { message: 'Hello' });
  }
}
