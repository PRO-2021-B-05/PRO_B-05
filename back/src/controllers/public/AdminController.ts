import {Controller, Get, Req, Request} from '@tsed/common';
import {NotFound} from '@tsed/exceptions';
import {deserialize} from '@tsed/json-mapper';
import {Authenticate} from '@tsed/passport';
import {Returns} from '@tsed/schema';
import {getRepository} from 'typeorm';

import {OnlyAdmin} from '../../decorators/OnlyAdmin';
import {Admin} from '../../entities/Admin';

@Controller('/admin')
@Authenticate()
@OnlyAdmin()
export class AdminController {
  private readonly adminRepository = getRepository(Admin);
  @Get('/')
  @(Returns(200, Admin).Groups('user.show'))
  async profile(@Req() req: Request) {
    const admin = await this.adminRepository.findOne({
      uuid: (req.user as Admin).uuid,
    });
    if (!admin) {
      throw new NotFound('Could not find this admin');
    }
    return deserialize(admin, {type: Admin, groups: ['user.show']});
  }
}
