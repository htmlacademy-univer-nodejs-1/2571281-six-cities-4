import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';
import { CreateUserDto } from './create-user.dto.js';
import { UserService } from './user.service.js';
import { TYPES } from '../../types.js';
import { UserResponseDto } from './user-response.dto.js';
import { plainToInstance } from 'class-transformer';
import { validateDto } from '../../app/middleware/validate-dto.middleware.js';
import { buildUploadMiddleware } from '../../app/middleware/upload-file.middleware.js';
import { ConfigService } from '../../config/config.service.js';

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
      middlewares: [
        buildUploadMiddleware(this.config),
        validateDto(CreateUserDto),
      ],
    });
  }

  private async register(
    req: Request<unknown, unknown, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const { body, file } = req;

    const createDto: CreateUserDto = { ...body };

    const newUser = await this.userService.create(createDto);

    const avatarUrl = file ? `/static/${file.filename}` : '/static/default-avatar.png';
    await this.userService.updateAvatar(newUser._id, avatarUrl);
    newUser.avatarUrl = avatarUrl;

    this.created(
      res,
      plainToInstance(UserResponseDto, newUser, { excludeExtraneousValues: true })
    );
  }
}
