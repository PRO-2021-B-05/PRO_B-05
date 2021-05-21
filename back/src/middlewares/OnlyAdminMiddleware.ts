import {EndpointInfo, IMiddleware, Middleware, Req} from '@tsed/common';
import {Forbidden, Unauthorized} from '@tsed/exceptions';
import {Admin} from "../entities/Admin";

@Middleware()
export class OnlyAdminMiddleware implements IMiddleware{
  use(@Req() request: Req, @EndpointInfo() endpoint: EndpointInfo) {
    console.log(request.user);
    if (!(request.user instanceof Admin)){
      throw new Forbidden('Insufficient role');
    }
  }
}
