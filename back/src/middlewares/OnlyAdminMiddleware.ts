import {EndpointInfo, Middleware, Req} from '@tsed/common';
import {Unauthorized} from '@tsed/exceptions';
import {Admin} from "../entities/Admin";

@Middleware()
export class OnlyAdminMiddleware {
  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {

    if (!(request.user instanceof Admin)){
      throw new Unauthorized('Insufficient role');
    }
  }
}
