import { injectable, inject } from 'inversify';
import { UserServiceInterface } from './user.service.interface.js';
import { TYPES } from '../../types.js';
import { LoggerInterface } from '../../libs/logger.interface.js';
import { UserEntity, UserModel } from './index.js';
import { CreateUserDto } from './create-user.dto.js';
import { Types } from 'mongoose';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @inject(TYPES.Logger) private readonly logger: LoggerInterface,
    @inject(TYPES.UserModel) private readonly userModel: typeof UserModel,
  ) {}

  public async updateAvatar(userId: Types.ObjectId, avatarUrl: string): Promise<void> {
    await this.userModel.updateOne({ _id: userId }, { avatarUrl }).exec();
    this.logger.info(`[User] avatar updated for user ${userId.toHexString()}`);
  }

  public async create(dto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userModel.create(dto);
    this.logger.info(`[User] created: ${user.id}`);
    return user;
  }

  public findById(id: string): Promise<UserEntity | null> {
    return this.userModel.findById(id).exec();
  }

  public findByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
