import {BodyParams, Controller, Get, Post, Req, UseAuth} from '@tsed/common';
import {Unauthorized} from '@tsed/exceptions';
import {Authenticate, Authorize} from '@tsed/passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';

import {Admin} from "../../../entities/Admin";
import {Student} from "../../../entities/Student";
import {User} from "../../../entities/User";

@Controller('/auth')
export class AuthController {
  private adminRepository = getRepository(Admin);
  private studentRepository = getRepository(Student);
  private userRepository = getRepository(User);

  @Post('/login')
  async login(
    @BodyParams('username') username: string,
    @BodyParams('password') password: string
  ) {
    const user = await this.userRepository.findOne({username});
    if (!user || !(await user.verifyPassword(password))) {
      throw new Unauthorized('Wrong credentials');
    }
    const token = jwt.sign(
      {
        uuid: user.uuid,
        type: user.type
      },
      'secret',
      {expiresIn: '1d'}
    );
    return {type : user.type, token};
  }

  @Post('/register')
  async registerAdmin(@BodyParams(Admin) user: Admin) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.adminRepository.save(user);
  }

  @Post('/register2')
  async registerStudent(@BodyParams(Student) user: Student) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.studentRepository.save(user);
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
