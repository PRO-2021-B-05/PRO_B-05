import {BodyParams, Controller, Get, Post, Req, UseAuth} from '@tsed/common';
import {Unauthorized} from '@tsed/exceptions';
import {Authenticate, Authorize} from '@tsed/passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';

import {AcceptRoles} from '../../decorators/AcceptRoles';
import {User} from '../../entities/User';

@Controller('/auth')
export class AuthController {
  private userRepository = getRepository(User);

  @Post('/login')
  async login(
    @BodyParams('email') email: string,
    @BodyParams('password') password: string
  ) {
    const user = await this.userRepository.findOne({email});
    if (!user || !(await user.verifyPassword(password))) {
      throw new Unauthorized('Wrong credentials');
    }
    const token = jwt.sign(
      {
        uuid: user.uuid,
      },
      'secret',
      {expiresIn: '1d'}
    );
    return {token};
  }

  @Post('/register')
  async register(@BodyParams(User) user: User) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.userRepository.save(user);
  }

  @Get('/')
  @Authorize()
  async get(@Req() request: Req) {
    return {
      auth: request.isAuthenticated(),
      user: request.user,
    };
  }
}
