import { Types } from 'mongoose';
import { HttpError } from '../../common/errors/http-error.js';
import { Middleware } from './middleware.interface.js';

export const validateObjectId =
  (paramName: string): Middleware =>
    (req, _res, next) => {
      const value = req.params[paramName];

      if (!Types.ObjectId.isValid(value)) {
        return next(
          new HttpError(400, 'Invalid ObjectId', {
            param: paramName,
            value,
          }),
        );
      }

      next();
    };
