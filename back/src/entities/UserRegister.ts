import {MaxLength, MinLength, Pattern, Required} from '@tsed/schema';

/**
 * Classe contenant les informations nécessaires pour authentifier un
 * utilisateur.
 *
 */
//TODO: A supprimer
export class UserRegister {
  /**
   * Pseudo de l'utilisateur.
   *
   */
  @Pattern(/^[a-zA-Z0-9_-]{3,15}$/)
  @MinLength(3)
  @MaxLength(15)
  @Required()
  username: string;

  /**
   * Mot de passe de l'utilisateur.
   *
   */
  @MinLength(8)
  @Required()
  password: string;

  /**
   * Prénom de l'utilisateur.
   *
   */
  @Required()
  firstname: string;

  /**
   * Nom de famille de l'utilisateur.
   *
   */
  @Required()
  lastname: string;
}
