import {BodyParams, Controller, Post} from '@tsed/common';
import {Unauthorized} from '@tsed/exceptions';
import {deserialize} from '@tsed/json-mapper';
import {Authenticate} from '@tsed/passport';
import {Groups, Returns} from '@tsed/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {getRepository} from 'typeorm';

import {OnlyAdmin} from '../../../decorators/OnlyAdmin';
import {Admin} from '../../../entities/Admin';
import {Student} from '../../../entities/Student';
import {User} from '../../../entities/User';

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
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('Need JWT secret');
    const token = jwt.sign(
      {
        uuid: user.uuid,
        type: user.type,
      },
      secret,
      {expiresIn: '1d'}
    );
    return {type: user.type, token};
  }

  @Post('/registerAdmin')
  @Authenticate()
  @OnlyAdmin()
  @(Returns(201, Admin).Groups('user.show'))
  async registerAdmin(
    @BodyParams(Admin) @Groups('user.register') admin: Partial<Admin>
  ) {
    admin.password = await bcrypt.hash(admin.password, 10);
    return deserialize(await this.adminRepository.save(admin), {
      type: Admin,
      groups: ['user.show'],
    });
  }

  @Post('/registerStudent')
  @Authenticate()
  @OnlyAdmin()
  @(Returns(201, Student).Groups('user.show'))
  async registerStudent(
    @BodyParams(Student) @Groups('user.register') student: Partial<Student>
  ) {
    student.password = await bcrypt.hash(student.password, 10);
    return deserialize(await this.studentRepository.save(student), {
      type: Student,
      groups: ['user.show'],
    });
  }
}
