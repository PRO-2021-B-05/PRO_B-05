import { BodyParams, Controller, Get, Put, Req, Request } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { deserialize } from '@tsed/json-mapper';
import { Authenticate } from '@tsed/passport';
import { Groups, Returns } from '@tsed/schema';
import { getRepository } from 'typeorm';

import { Student } from '../../entities/Student';

/**
 * Contrôleur permettant à un étudiant connecté d'accèder à ses informations.
 *
 */
@Controller('/profile')
@Authenticate()
export class MyProfileController {
  /**
   * Accès à la table des étudiants dans la base de donnée.
   *
   */
  private studentRepository = getRepository(Student);

  /**
   * Permet de lire les informations de l'étudiant connecté ayant formulé
   * la requête.
   *
   * @param req La requête envoyée par le client.
   * @returns Les informations de l'étudiant connecté.
   *
   */
  @Get('/')
  @(Returns(200, Student).Groups('user.show'))
  async profile(@Req() req: Request) {
    const student = await this.studentRepository.findOne({
      uuid: (req.user as Student).uuid,
    });
    if (!student) {
      throw new NotFound('Could not find requested student');
    }
    return deserialize(student, { type: Student, groups: ['user.show'] });
  }

  /**
   * Permet de modifier les informations de l'étudiant connecté ayant formulé
   * la requête.
   *
   * @param req La requête envoyée par le client.
   * @param student Les informations de l'étudiant à modifier.
   * @returns Les informations de l'étudiant après modification.
   *
   */
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

    await this.studentRepository.update({ uuid: existingStudent.uuid }, student);
    return deserialize(
      await this.studentRepository.findOne({ uuid: existingStudent.uuid }),
      { type: Student, groups: ['user.show'] }
    );
  }
}
