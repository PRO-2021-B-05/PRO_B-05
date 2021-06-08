import { UseBeforeEach } from '@tsed/common';
import { useDecorators } from '@tsed/core';

import { OnlyAdminMiddleware } from '../middlewares/OnlyAdminMiddleware';

/**
 * Décorateur permettant à un administrateur connecté uniquement d'exécuter
 * une requête.
 *
 */
export function OnlyAdmin() {
  return useDecorators(UseBeforeEach(OnlyAdminMiddleware));
}
