import { Controller, Get, PathParams, QueryParams } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { Authenticate } from '@tsed/passport';
import { getRepository } from 'typeorm';

import { OnlyAdmin } from '../../decorators/OnlyAdmin';
import { User } from '../../entities/User';

/**
 * Contrôleur permettant d'accèder aux informations d'un utilisateur.
 *
 */
@Controller('/users')
@Authenticate()
@OnlyAdmin()
export class UserController {
  /**
   * Accès à la table des utilisateurs dans la base de données.
   *
   */
  private userRepository = getRepository(User);

  /**
   * Permet de lister tous les utilisateurs.
   *
   * @param offset Le numéro du premier utilisateur de la liste.
   * @param limit Le nombre d'utilisateur de la liste à renvoyer.
   * @returns La liste des utilisateurs à partir du numéro donné.
   *
   */
  @Get('/')
  async listAll(
    @QueryParams('offset') offset: number,
    @QueryParams('limit') limit: number
  ) {
    const users = await this.userRepository.find({
      skip: offset,
      take: limit,
    });

    return users.map(({ uuid }) => ({ uuid }));
  }

  /**
   * Permet de lire les informations d'un utilisateur.
   *
   * @param uuid L'identifiant unique de l'utilisateur.
   * @returns Les informations de l'utilisateur demandé.
   *
   */
  @Get('/:uuid')
  async get(@PathParams('uuid') uuid: string) {
    const user = await this.userRepository.findOne({ uuid });

    if (!user) {
      throw new NotFound('Could not find requested user');
    }

    return {
      username: user.username,
      password: user.password,
      firstname: user.firstname,
      lastname: user.lastname,
    };
  }
}
