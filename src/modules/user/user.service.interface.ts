import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './create-user.dto.js';
import { DatabaseRepositoryInterface } from '../../common/database.repository.interface.js';
import { Types } from 'mongoose';

export interface UserServiceInterface
  extends DatabaseRepositoryInterface<UserEntity, CreateUserDto> {
  findByEmail(email: string): Promise<UserEntity | null>;
  updateAvatar(userId: Types.ObjectId, avatarUrl: string): Promise<void>;
}
