import { Container } from 'inversify';
import { TYPES } from '../types.js';
import { Application } from '../app/application.js';
import { PinoLogger } from '../libs/logger.js';
import { ConvictConfigService } from '../config/config.service.js';
import { MongooseService } from '../database/mongoose.service.js';
import { DatabaseClient } from '../database/database-client.interface.js';
import { UserService } from '../modules/user/user.service.js';
import { OfferService } from '../modules/offer/offer.service.js';
import { UserServiceInterface } from '../modules/user/user.service.interface.js';
import { OfferServiceInterface } from '../modules/offer/offer.service.interface.js';
import { UserModel } from '../modules/user/index.js';
import { OfferModel } from '../modules/offer/index.js';
import { CommentModel, CommentService, CommentServiceInterface } from '../modules/comment/index.js';
import { FavoriteModel, FavoriteService, FavoriteServiceInterface } from '../modules/favorite/index.js';
import { UserController } from '../modules/user/user.controller.js';
import { OfferController } from '../modules/offer/offer.controller.js';
import { FavoriteController } from '../modules/favorite/favorite.controller.js';
import { AuthController } from '../modules/auth/auth.controller.js';
import { ExceptionFilter } from '../common/errors/exception.filter.js';
import { CommentController } from '../modules/comment/comment.controller.js';

const container = new Container();

container.bind(TYPES.Application).to(Application).inSingletonScope();
container.bind(TYPES.Logger).to(PinoLogger).inSingletonScope();
container.bind(TYPES.Config).to(ConvictConfigService).inSingletonScope();
container
  .bind<DatabaseClient>(TYPES.DatabaseClient)
  .to(MongooseService)
  .inSingletonScope();

container.bind<UserServiceInterface>(TYPES.UserService)
  .to(UserService).inSingletonScope();

container.bind<OfferServiceInterface>(TYPES.OfferService)
  .to(OfferService).inSingletonScope();

container.bind<typeof UserModel>(TYPES.UserModel)
  .toConstantValue(UserModel);

container.bind<typeof OfferModel>(TYPES.OfferModel)
  .toConstantValue(OfferModel);

container
  .bind<typeof CommentModel>(TYPES.CommentModel)
  .toConstantValue(CommentModel);

container
  .bind<CommentServiceInterface>(TYPES.CommentService)
  .to(CommentService);

container
  .bind<FavoriteServiceInterface>(TYPES.FavoriteService)
  .to(FavoriteService);

container
  .bind<typeof FavoriteModel>(TYPES.FavoriteModel)
  .toConstantValue(FavoriteModel);

container.bind<UserController>(UserController).toSelf().inSingletonScope();
container.bind<OfferController>(OfferController).toSelf().inSingletonScope();
container.bind(FavoriteController).toSelf().inSingletonScope();
container.bind(AuthController).toSelf().inSingletonScope();
container.bind(CommentController).toSelf().inSingletonScope();

container
  .bind<ExceptionFilter>(TYPES.ExceptionFilter)
  .to(ExceptionFilter)
  .inSingletonScope();

export { container };
