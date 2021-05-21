import {BodyParams, Controller, Get, Put, Req, Request} from '@tsed/common';
import {NotFound} from '@tsed/exceptions';
import {deserialize} from '@tsed/json-mapper';
import {Authenticate} from '@tsed/passport';
import {Groups, Returns} from '@tsed/schema';
import {getRepository} from 'typeorm';

import {Student} from '../../entities/Student';

@Controller('/profile')
@Authenticate()
export class MyProfileController {
  private studentRepository = getRepository(Student);

  @Get('/')
  @(Returns(200, Student).Groups('user.show'))
  async profile(@Req() req: Request) {
    const student = await this.studentRepository.findOne({
      uuid: (req.user as Student).uuid,
    });
    if (!student) {
      throw new NotFound('Could not find requested student');
    }
    return deserialize(student, {type: Student, groups: ['user.show']});
  }

  @Put('/')
  @(Returns(200, Student).Groups('user.show'))
  async put(
    @Req() req: Request,
    @BodyParams(Student) @Groups('user.update') student: Student
  ) {
    const existingStudent = req.user as Student;
    if (!existingStudent) {
      throw new NotFound('Could not find requested student');
    }

    await this.studentRepository.update({uuid: existingStudent.uuid}, student);
    return deserialize(
      await this.studentRepository.findOne({uuid: existingStudent.uuid}),
      {type: Student, groups: ['user.show']}
    );
  }
}
