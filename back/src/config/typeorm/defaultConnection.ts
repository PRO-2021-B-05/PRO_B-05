import {ConnectionOptions} from 'typeorm';

export default (): ConnectionOptions => ({
  name: 'default',
  type: 'mariadb',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT ?? ''),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  synchronize: true,
  logging: process.env.DATABASE_LOGIN === 'true',
  entities: ['${rootDir}/entities/**/*.ts'],
  migrations: ['${rootDir}/migration/**/*.ts'],
  subscribers: ['${rootDir}/subscriber/**/*.ts'],
  cli: {
    entitiesDir: '${rootDir}/entity',
    migrationsDir: '${rootDir}/migration',
    subscribersDir: '${rootDir}/subscriber',
  },
});
