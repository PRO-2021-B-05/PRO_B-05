import {UseBefore, UseBeforeEach} from '@tsed/common';
import {StoreSet, useDecorators} from '@tsed/core';

import {OnlyAdminMiddleware} from '../middlewares/OnlyAdminMiddleware';

export function OnlyAdmin() {
  return useDecorators(
    UseBeforeEach(OnlyAdminMiddleware)
  );
}
