import {Req} from '@tsed/common';
import {Arg, OnVerify, Protocol} from '@tsed/passport';
import {ExtractJwt, Strategy, StrategyOptions} from 'passport-jwt';
import {getRepository} from 'typeorm';

import {User} from '../entities/User';
import {Admin} from "../entities/Admin";
import {Student} from "../entities/Student";

@Protocol<StrategyOptions>({
  name: 'jwt',
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
    ignoreExpiration: false,
  },
})
export class JwtProtocol implements OnVerify {
  private adminRepository = getRepository(Admin);
  private studentRepository = getRepository(Student);

  async $onVerify(
    @Req() req: Req,
    @Arg(0) jwtPayload: any
  ): Promise<boolean | User> {
    if (!jwtPayload?.uuid) return false;
    const user = jwtPayload.type == Admin.name ?
        await this.adminRepository.findOne({uuid: jwtPayload.uuid}) :
        await this.studentRepository.findOne({uuid: jwtPayload.uuid});

    req.user = user;
    return user ?? false;
  }
}
