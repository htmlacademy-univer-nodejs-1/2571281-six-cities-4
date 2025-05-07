import 'reflect-metadata';
import { injectable } from 'inversify';
import type { Path, PathValue } from 'convict';
import { appConfig } from './config.js';
import type { AppSchema } from './config.js';

export interface ConfigService {
  get<K extends Path<AppSchema>>(key: K): PathValue<AppSchema, K>;
}

@injectable()
export class ConvictConfigService implements ConfigService {
  get<K extends Path<AppSchema>>(key: K): PathValue<AppSchema, K> {
    return appConfig.get(key) as PathValue<AppSchema, K>;
  }
}
