import { UserType } from './user.enum.js';

export type RegisterUserDto = {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  type?: UserType;
};
