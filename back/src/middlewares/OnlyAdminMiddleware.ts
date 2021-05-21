import {IMiddleware, Middleware, Req} from '@tsed/common';
import {Forbidden} from '@tsed/exceptions';

import {Admin} from '../entities/Admin';

@Middleware()
export class OnlyAdminMiddleware implements IMiddleware {
  use(@Req() request: Req) {
    console.log(request.user);
    if (!(request.user instanceof Admin)) {
      throw new Forbidden('Insufficient role');
    }
  }
}
