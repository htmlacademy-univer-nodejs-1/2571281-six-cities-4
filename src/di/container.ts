import { Container } from 'inversify';
import { TYPES } from '../types.js';
import { Application } from '../app/application.js';
import { PinoLogger } from '../libs/logger.js';
import { ConvictConfigService } from '../config/config.service.js';
import { MongooseService } from '../database/mongoose.service.js';
import { DatabaseClient } from '../database/database-client.interface.js';

const container = new Container();

container.bind(TYPES.Application).to(Application).inSingletonScope();
container.bind(TYPES.Logger).to(PinoLogger).inSingletonScope();
container.bind(TYPES.Config).to(ConvictConfigService).inSingletonScope();
container
  .bind<DatabaseClient>(TYPES.DatabaseClient)
  .to(MongooseService)
  .inSingletonScope();

export { container };
