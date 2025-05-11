import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpError } from '../../common/errors/http-error.js';
import { Middleware } from './middleware.interface.js';

export const validateDto =
  <T extends object>(dtoClass: new () => T): Middleware =>
    async (req, _res, next) => {
      const dto = plainToInstance(dtoClass, req.body, {
        enableImplicitConversion: true,
      });

      const errors = await validate(dto, { whitelist: true });

      if (errors.length > 0) {
        const messages = errors.flatMap((e) =>
          Object.values(e.constraints ?? {}),
        );

        return next(
          new HttpError(400, 'Validation error', {
            errors: messages,
          }),
        );
      }

      req.body = dto as unknown as Record<string, unknown>;
      next();
    };
