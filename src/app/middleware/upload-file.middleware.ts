import multer from 'multer';
import { customAlphabet } from 'nanoid';
import mime from 'mime-types';
import path from 'node:path';
import { ConfigService } from '../../config/config.service.js';
import { Middleware } from './middleware.interface.js';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  16,
);

export const buildUploadMiddleware = (
  config: ConfigService,
): Middleware => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) =>
      cb(null, path.resolve(config.get('UPLOAD_DIR'))),

    filename: (_req, file, cb) =>
      cb(null, `${nanoid()}.${mime.extension(file.mimetype) || 'bin'}`),
  });

  return multer({ storage }).single('file');
};
