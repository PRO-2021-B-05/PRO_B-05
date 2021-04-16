import '@tsed/platform-express'; // /!\ keep this import
import '@tsed/ajv';
import '@tsed/swagger';
import '@tsed/typeorm';
import '@tsed/passport';

import {$log, PlatformApplication} from '@tsed/common';
import {Env} from '@tsed/core';
import {Configuration, Inject} from '@tsed/di';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import methodOverride from 'method-override';

import SMS3Config from './config/SMS3Config';
import typeormConfig from './config/typeorm';
import {IndexCtrl} from './controllers/pages/IndexCtrl';
import {User} from './entities/User';

dotenv.config();

export const rootDir = __dirname;
export const isProduction = process.env.NODE_ENV === Env.PROD;

if (isProduction) {
  $log.appenders.set('stdout', {
    type: 'stdout',
    levels: ['info', 'debug'],
    layout: {
      type: 'json',
    },
  });

  $log.appenders.set('stderr', {
    levels: ['trace', 'fatal', 'error', 'warn'],
    type: 'stderr',
    layout: {
      type: 'json',
    },
  });
}

@Configuration({
  rootDir,
  acceptMimes: ['application/json'],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  logger: {
    disableRoutesSummary: isProduction,
  },
  mount: {
    '/api/v1': [`${rootDir}/controllers/**/*.ts`],
    '/': [IndexCtrl],
  },
  componentsScan: [
    `${rootDir}/protocols/*{.ts,.js}`,
    `${rootDir}/services/*{.ts,.js}`,
    `${rootDir}/middlewares/*{.ts,.js}`,
  ],
  passport: {
    userInfoModel: User,
  },
  swagger: [
    {
      path: '/docs/v1',
      specVersion: '3.0.1',
    },
  ],
  views: {
    root: `${rootDir}/../views`,
    viewEngine: 'ejs',
  },
  typeorm: typeormConfig(),
  exclude: ['**/*.spec.ts'],
  sms3: SMS3Config(),
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true,
        })
      );
  }
}
