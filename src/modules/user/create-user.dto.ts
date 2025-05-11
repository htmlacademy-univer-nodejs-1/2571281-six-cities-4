import { IsString, Length, IsEmail, IsOptional, IsEnum } from 'class-validator';

export enum UserType {
  Regular = 'regular',
  Pro = 'pro',
}

export class CreateUserDto {
  @IsString()
  @Length(1, 15)
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsOptional()
  @IsString()
  public avatarUrl?: string;

  @IsString()
  @Length(6, 12)
  public password!: string;

  @IsEnum(UserType)
  public type!: UserType;
}
