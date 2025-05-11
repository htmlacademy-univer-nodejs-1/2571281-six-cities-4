import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';
import { CreateUserDto } from './create-user.dto.js';
import { createSHA256 } from '../../libs/crypto.js';
import { UserService } from './user.service.js';
import { TYPES } from '../../types.js';
import { UserResponseDto } from './user-response.dto.js';
import { ConfigService } from '../../config/config.service.js';
import { RegisterUserDto } from './register-user.dto.js';
import { plainToInstance } from 'class-transformer';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.Config) private readonly config: ConfigService,
  ) {
    super();

    this.addRoute({
      path: '/users',
      method: HttpMethod.Post,
      handler: this.register,
    });
  }

  private async register(
    { body }: Request<unknown, unknown, RegisterUserDto>,
    res: Response
  ): Promise<void> {

    const salt = this.config.get('SALT');
    const passwordHash = createSHA256(body.password, salt);

    const createDto: CreateUserDto = {
      ...body,
      passwordHash,
    };

    const newUser = await this.userService.create(createDto);

    this.created(res, plainToInstance(UserResponseDto, newUser));
  }
}
