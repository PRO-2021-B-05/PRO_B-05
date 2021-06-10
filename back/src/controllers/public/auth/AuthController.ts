import { BodyParams, Controller, Post } from '@tsed/common';
import { Unauthorized } from '@tsed/exceptions';
import { deserialize } from '@tsed/json-mapper';
import { Authenticate } from '@tsed/passport';
import { Groups, Returns } from '@tsed/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

import { OnlyAdmin } from '../../../decorators/OnlyAdmin';
import { Admin } from '../../../entities/Admin';
import { Student } from '../../../entities/Student';
import { User } from '../../../entities/User';

/**
 * Contrôleur permettant de créer et authentifier un utilisateur.
 *
 */
@Controller('/auth')
export class AuthController {
  /**
   * Accès à la table des administrateurs dans la base de données.
   *
   */
  private adminRepository = getRepository(Admin);

  /**
   * Accès à la table des étudiants dans la base de données.
   *
   */
  private studentRepository = getRepository(Student);

  /**
   * Accès à la table des utilisateurs dans la base de données.
   *
   */
  private userRepository = getRepository(User);

  /**
   * Permet à un utilisateur existant de s'authentifier.
   *
   * @param username Le pseudo de l'utilisateur.
   * @param password Le mot de passe de l'utilisateur.
   * @returns Un token permettant d'identifier l'utilisateur lors de ses requêtes.
   *
   */
  @Post('/login')
  async login(
    @BodyParams('username') username: string,
    @BodyParams('password') password: string
  ) {
    const user = await this.userRepository.findOne({ username });
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
      { expiresIn: '1d' }
    );
    return { type: user.type, token };
  }

  /**
   * Permet de créer un administrateur.
   *
   * @param admin Les informations de l'administrateur à créer.
   * @returns Les informations de l'administrateur créé.
   *
   */
  @Post('/registerAdmin')
  @Authenticate()
  @OnlyAdmin()
  @(Returns(201, Admin).Groups('user.show'))
  async registerAdmin(
    @BodyParams(Admin) @Groups('user.register') admin: Admin
  ) {
    admin.password = await bcrypt.hash(admin.password, 10);
    return deserialize(await this.adminRepository.save(admin), {
      type: Admin,
      groups: ['user.show'],
    });
  }

  /**
   * Permet de créer un étudiant.
   *
   * @param student Les informations de l'étudiant à créer.
   * @returns Les informations de l'étudiant créé.
   *
   */
  @Post('/registerStudent')
  @Authenticate()
  @OnlyAdmin()
  @(Returns(201, Student).Groups('user.show'))
  async registerStudent(
    @BodyParams(Student) @Groups('user.register') student: Student
  ) {
    student.password = await bcrypt.hash(student.password, 10);
    return deserialize(await this.studentRepository.save(student), {
      type: Student,
      groups: ['user.show'],
    });
  }
}
