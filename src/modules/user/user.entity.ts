import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { UserType } from './user.enum.js';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection : 'users',
    timestamps : true,
  },
})
export class UserEntity {
  public _id!: Types.ObjectId;

  @prop({ required: true, minlength: 1, maxlength: 15 })
  public name!: string;

  @prop({ required: true, unique: true, lowercase: true })
  public email!: string;

  @prop()
  public avatarUrl?: string;

  @prop({ required: true })
  public passwordHash!: string;

  @prop({ required: true, enum: UserType, default: UserType.Regular })
  public type!: UserType;
}

export const UserModel = getModelForClass(UserEntity);
