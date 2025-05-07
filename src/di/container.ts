import { Container } from 'inversify';
import { TYPES } from '../types.js';
import { Application } from '../app/application.js';
import { PinoLogger } from '../libs/logger.js';
import { ConvictConfigService } from '../config/config.service.js';

const container = new Container();

container.bind(TYPES.Application).to(Application).inSingletonScope();
container.bind(TYPES.Logger).to(PinoLogger).inSingletonScope();
container.bind(TYPES.Config).to(ConvictConfigService).inSingletonScope();

export { container };
