import { UserType } from './user.enum.js';

export type CreateUserDto = {
    name: string;
    email: string;
    passwordHash: string;
    avatarUrl?: string;
    type?: UserType;
  };
