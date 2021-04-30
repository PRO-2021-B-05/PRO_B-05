import { ConnectionOptions } from 'typeorm';
import {Env} from "@tsed/core";

export default (): ConnectionOptions => ({
  name: 'default',
  type: 'mariadb',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? ""),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  synchronize: true,
  logging: process.env.DATABASE_LOGIN === 'true',
  entities: ['${rootDir}/entities/**/*{.ts,.js}'],
});
