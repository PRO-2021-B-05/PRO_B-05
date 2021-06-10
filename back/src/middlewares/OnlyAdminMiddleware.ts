import { IMiddleware, Middleware, Req } from '@tsed/common';
import { Forbidden } from '@tsed/exceptions';

import { Admin } from '../entities/Admin';

/**
 * Middleware permettant de vérifier que l'utilisateur connecté ayant formulé
 * la requête est un administrateur.
 *
 */
@Middleware()
export class OnlyAdminMiddleware implements IMiddleware {
  /**
   * Vérifie que la requête provient d'un administrateur connecté.
   *
   * @param request La requête à vérifier.
   *
   */
  use(@Req() request: Req) {
    console.log(request.user);
    if (!(request.user instanceof Admin)) {
      throw new Forbidden('Insufficient role');
    }
  }
}
