import {
  BodyParams,
  Controller,
  Delete,
  Get,
  PathParams,
  Put,
  QueryParams,
} from '@tsed/common';
import {Inject} from '@tsed/di';
import {NotFound} from '@tsed/exceptions';
import {deserialize} from '@tsed/json-mapper';
import {Authenticate} from '@tsed/passport';
import {Groups, Returns, Status} from '@tsed/schema';
import bcrypt from 'bcrypt';
import {getRepository} from 'typeorm';

import {OnlyAdmin} from '../../decorators/OnlyAdmin';
import {Pagination} from '../../entities/Pagination';
import {Student} from '../../entities/Student';
import {SMS3StorageService} from '../../services/SMS3StorageService';

@Controller('/students')
export class StudentController {
  @Inject() private s3: SMS3StorageService;
  private studentRepository = getRepository(Student);

  @Get('/')
  @(Returns(200, Pagination).Of(Student).Groups('user.show'))
  async listAll(
    @QueryParams('offset') offset: number,
    @QueryParams('limit') limit: number
  ) {
    const results = deserialize(
      await this.studentRepository.find({
        skip: offset,
        take: limit,
        order: {lastname: 'ASC'},
      }),
      {
        type: Student,
        groups: ['user.show'],
      }
    );
    const total = await this.studentRepository.count();
    return new Pagination<Student>({results, total, offset, limit});
  }

  @Get('/:uuid')
  @(Returns(200, Student).Groups('user.show'))
  async get(@PathParams('uuid') uuid: string) {
    const student = await this.studentRepository.findOne({uuid});

    if (!student) {
      throw new NotFound('Could not find requested student');
    }

    return deserialize(student, {type: Student, groups: ['user.show']});
  }

  @Put('/:uuid')
  @Authenticate()
  @OnlyAdmin()
  @(Returns(200, Student).Groups('user.show'))
  async put(
    @PathParams('uuid') uuid: string,
    @BodyParams(Student)
    @Groups('user.update', 'user.admin')
    student: Student
  ) {
    const existingStudent = await this.studentRepository.findOne({uuid});
    if (!existingStudent) {
      throw new NotFound('Could not find requested student');
    }
    if (student.password)
      student.password = await bcrypt.hash(student.password, 10);

    await this.studentRepository.update({uuid: existingStudent.uuid}, student);

    return deserialize(
      await this.studentRepository.findOne({uuid: existingStudent.uuid}),
      {
        type: Student,
        groups: ['user.show'],
      }
    );
  }

  @Delete('/:uuid')
  @Authenticate()
  @OnlyAdmin()
  @Status(200)
  async delete(@PathParams('uuid') uuid: string) {
    const student = await this.studentRepository.findOne(
      {uuid},
      {relations: ['projects']}
    );
    if (!student) {
      throw new NotFound('Could not find requested student');
    }
    await this.studentRepository.delete({uuid});
    student.projects.forEach(project => {
      this.s3.deleteFolder('start', `${project.uuid}`);
    });
  }
}
