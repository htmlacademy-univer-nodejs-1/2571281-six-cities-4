import { Expose } from 'class-transformer';
import { UserType } from './user.enum.js';

export class UserResponseDto {
  @Expose({ name: 'id' })
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarUrl?: string;

  @Expose()
  public type!: UserType;
}
