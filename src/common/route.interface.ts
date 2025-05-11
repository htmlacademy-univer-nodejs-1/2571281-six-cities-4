import { type Request, type Response, type NextFunction } from 'express';
import { HttpMethod } from './http-method.enum.js';
import { Middleware } from '../app/middleware/middleware.interface.js';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
  middlewares: Middleware[];
}

