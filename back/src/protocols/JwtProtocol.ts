import {Req} from '@tsed/common';
import {Arg, OnVerify, Protocol} from '@tsed/passport';
import {ExtractJwt, Strategy, StrategyOptions} from 'passport-jwt';
import {getRepository} from 'typeorm';

import {Admin} from '../entities/Admin';
import {Student} from '../entities/Student';
import {User} from '../entities/User';

/**
 * Décorateur servant à générer les tokens JWT d'authentification.
 *
 */
@Protocol<StrategyOptions>({
  name: 'jwt',
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    ignoreExpiration: false,
  },
})

/**
 * Classe servant à vérifier les tokens JWT d'authentification.
 *
 */
export class JwtProtocol implements OnVerify {
  private adminRepository = getRepository(Admin);
  private studentRepository = getRepository(Student);

  async $onVerify(
    @Req() req: Req,
    @Arg(0)
    jwtPayload: {
      type: string;
      uuid: string;
    }
  ): Promise<boolean | User> {
    if (!jwtPayload?.uuid) return false;
    const user =
      jwtPayload.type === Admin.name
        ? await this.adminRepository.findOne({uuid: jwtPayload.uuid})
        : await this.studentRepository.findOne({uuid: jwtPayload.uuid});

    req.user = user;
    return user ?? false;
  }
}
