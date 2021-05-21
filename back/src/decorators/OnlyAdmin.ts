import {UseBeforeEach} from '@tsed/common';
import {useDecorators} from '@tsed/core';

import {OnlyAdminMiddleware} from '../middlewares/OnlyAdminMiddleware';

export function OnlyAdmin() {
  return useDecorators(UseBeforeEach(OnlyAdminMiddleware));
}
