import {BodyParams, Controller, Get, Post, Req, UseAuth} from '@tsed/common';
import {Unauthorized} from '@tsed/exceptions';
import {Authenticate, Authorize} from '@tsed/passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';

import {Admin} from "../../../entities/Admin";
import {Student} from "../../../entities/Student";
import {User} from "../../../entities/User";
import {UserRegister} from "../../../entities/UserRegister";
import {OnlyAdmin} from "../../../decorators/OnlyAdmin";

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
  async registerAdmin(@BodyParams(UserRegister) user: UserRegister) {
    const admin = new Admin();
    admin.username = user.username;
    admin.password = await bcrypt.hash(user.password, 10);
    admin.firstname = user.firstname;
    admin.lastname = user.lastname;
    return this.adminRepository.save(admin);
  }

  @Post('/register2')
  @Authenticate()
  @OnlyAdmin()
  async registerStudent(@BodyParams(UserRegister) user: UserRegister) {
    const student = new Student();
    student.username = user.username;
    student.password = await bcrypt.hash(user.password, 10);
    student.firstname = user.firstname;
    student.lastname = user.lastname;
    return this.studentRepository.save(student);
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
