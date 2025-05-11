import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';
import { CreateUserDto, UserType } from './create-user.dto.js';
import { UserService } from './user.service.js';
import { TYPES } from '../../types.js';
import { UserResponseDto } from './user-response.dto.js';
import { RegisterUserDto } from './register-user.dto.js';
import { plainToInstance } from 'class-transformer';
import { validateDto } from '../../app/middleware/validate-dto.middleware.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
  ) {
    super();

    this.addRoute({
      path: '/users',
      method: HttpMethod.Post,
      handler: this.register,
      middlewares: [validateDto(CreateUserDto)]
    });
  }

  private async register(
    { body }: Request<unknown, unknown, RegisterUserDto>,
    res: Response
  ): Promise<void> {
    const createDto: CreateUserDto = {
      name: body.name,
      email: body.email,
      password: body.password,
      avatarUrl: body.avatarUrl,
      type: body.type ?? UserType.Regular,
    };

    const newUser = await this.userService.create(createDto);

    this.created(res, plainToInstance(UserResponseDto, newUser));
  }
}
