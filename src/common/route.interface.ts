import { type Request, type Response, type NextFunction } from 'express';
import { HttpMethod } from './http-method.enum.js';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
  middlewares?: Array<(req: Request, res: Response, next: NextFunction) => void>;
}
