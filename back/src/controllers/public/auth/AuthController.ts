import {BodyParams, Controller, Get, Post, Req, UseAuth} from '@tsed/common';
import {Exception, Unauthorized} from '@tsed/exceptions';
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

    @Post('/registerAdmin')
    @Authenticate()
    @OnlyAdmin()
    @Returns(201, Admin).Groups("show")
    async registerAdmin(@BodyParams(Admin) @Groups("register") admin: Partial<Admin>) {
        admin.password = await bcrypt.hash(admin.password, 10);
        return deserialize(await this.adminRepository.save(admin), {type: Admin, groups: ['show']});
    }

    @Post('/registerStudent')
    @Authenticate()
    @OnlyAdmin()
    @Returns(201, Student).Groups("show")
    async registerStudent(@BodyParams(Student) @Groups("register") student: Partial<Student>) {
        student.password = await bcrypt.hash(student.password, 10);
        return deserialize(await this.studentRepository.save(student), {type: Student, groups: ['show']});
    }

}
