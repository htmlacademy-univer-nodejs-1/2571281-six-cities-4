import {
  Router,
  //   type Request,
  type Response,
//   type NextFunction,
} from 'express';
import expressAsyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { instanceToPlain } from 'class-transformer';

// import { HttpMethod } from '../http-method.enum.js';
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
    const boundHandler = expressAsyncHandler(handler.bind(this));
    this.router[method](path, ...middlewares, boundHandler);
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

  private send<T>(
    res: Response,
    statusCode: number,
    payload?: T | object,
  ): void {
    if (payload === undefined) {
      res.sendStatus(statusCode);
      return;
    }

    res.status(statusCode).json(instanceToPlain(payload));
  }
}
