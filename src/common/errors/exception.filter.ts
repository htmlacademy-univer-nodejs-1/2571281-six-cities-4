import { injectable, inject } from 'inversify';
import type { Request, Response, NextFunction } from 'express';

import { TYPES } from '../../types.js';
import type { LoggerInterface } from '../../libs/logger.interface.js';
import { HttpError } from './http-error.js';

@injectable()
export class ExceptionFilter {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface
  ) {}

  public catch = (err: unknown, req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof HttpError) {
      const logFn = this.logger.error;
      logFn.call(this.logger, `[${err.statusCode}] ${req.method} ${req.originalUrl} — ${err.message}`);

      res
        .status(err.statusCode)
        .json({
          message: err.message,
          details: err.details ?? null
        });
      return;
    }

    const unknown = err as Error;
    this.logger.error(`[500] ${req.method} ${req.originalUrl} — ${unknown?.message ?? 'Unknown error'}`, {
      stack: unknown?.stack
    });

    res
      .status(500)
      .json({ message: 'Internal Server Error' });
  };
}
