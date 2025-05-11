import {
  RequestHandler,
  Router,
  type Response,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import { RouteInterface } from '../route.interface.js';

export abstract class Controller {
  public readonly router: Router = Router();

  protected constructor() {}

  protected addRoute({
    path,
    method,
    handler,
    middlewares = [],
  }: RouteInterface): void {
    const boundHandler = handler.bind(this);
    const routeKey = method.toLowerCase() as keyof Router;
    (this.router[routeKey] as unknown as (
      path: string | RegExp,
      ...handlers: RequestHandler[]
    ) => Router)(
      path,
      ...middlewares,
      boundHandler,
    );
  }

  protected ok<T>(res: Response<T>, payload?: T): void {
    this.send(res, StatusCodes.OK, payload);
  }

  protected created<T>(res: Response<T>, payload?: T): void {
    this.send(res, StatusCodes.CREATED, payload);
  }

  protected noContent(res: Response): void {
    res.sendStatus(StatusCodes.NO_CONTENT);
  }

  protected badRequest(res: Response, message = 'Bad request'): void {
    this.send(res, StatusCodes.BAD_REQUEST, { message });
  }

  protected unauthorized(res: Response, message = 'Unauthorized'): void {
    this.send(res, StatusCodes.UNAUTHORIZED, { message });
  }

  protected forbidden(res: Response, message = 'Forbidden'): void {
    this.send(res, StatusCodes.FORBIDDEN, { message });
  }

  protected notFound(res: Response, message = 'Not found'): void {
    this.send(res, StatusCodes.NOT_FOUND, { message });
  }

  protected notImplemented(res: Response): void {
    res
      .status(StatusCodes.NOT_IMPLEMENTED)
      .json({ message: 'Not implemented' });
  }

  private send<T>(
    res: Response,
    statusCode: number,
    payload?: T | object,
  ): void {
    if (payload === undefined) {
      res.sendStatus(statusCode);
      return;
    }

    res.status(statusCode).json(payload);
  }
}
