import { HttpError } from '../../common/errors/http-error.js';
import { Middleware } from './middleware.interface.js';

export function checkExists<
  S extends { findById(id: string): Promise<unknown | null> },
>(
  paramName: string,
  service: S,
  entityLabel: string,
): Middleware {
  return async (req, _res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return next(
        new HttpError(400, `Missing param "${paramName}"`, { paramName }),
      );
    }

    const doc = await service.findById(id);
    if (!doc) {
      return next(
        new HttpError(404, `${entityLabel} not found`, { id }),
      );
    }

    next();
  };
}
