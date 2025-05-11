import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { HttpMethod } from '../../common/http-method.enum.js';
import { TYPES } from '../../types.js';
import { UserService } from '../user/user.service.js';
import { createSHA256 } from '../../libs/crypto.js';
import { ConfigService } from '../../config/config.service.js';

@injectable()
export class AuthController extends Controller {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService,
    @inject(TYPES.Config) private readonly config: ConfigService
  ) {
    super();

    this.addRoute({
      path: '/auth/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: []
    });
  }

  private async login(
    { body }: Request<unknown, unknown, { email: string; password: string }>,
    res: Response
  ): Promise<void> {

    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      return this.notFound(res, 'User not found');
    }

    const salt = this.config.get('SALT');
    const hash = createSHA256(body.password, salt);
    if (hash !== user.passwordHash) {
      return this.notFound(res, 'User not found');
    }

    this.ok(res, { accessToken: 'dummy-token' });
  }
}
