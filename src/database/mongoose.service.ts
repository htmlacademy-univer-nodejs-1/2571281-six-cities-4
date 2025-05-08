import mongoose from 'mongoose';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types.js';
import { LoggerInterface } from '../libs/logger.interface.js';
import { DatabaseClient } from './database-client.interface.js';

@injectable()
export class MongooseService implements DatabaseClient {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface
  ) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('[Mongo] trying to connect…');

    try {
      await mongoose.connect(uri);
      this.logger.info('[Mongo] connection established');
    } catch (err) {
      this.logger.error(`[Mongo] failed: ${(err as Error).message}`);
      throw err;
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('[Mongo] connection closed');
  }
}
