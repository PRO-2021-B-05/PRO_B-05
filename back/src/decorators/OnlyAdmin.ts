import {UseBefore} from '@tsed/common';
import {StoreSet, useDecorators} from '@tsed/core';

import {OnlyAdminMiddleware} from '../middlewares/OnlyAdminMiddleware';

export function OnlyAdmin() {
  return useDecorators(
    UseBefore(OnlyAdminMiddleware)
  );
}
