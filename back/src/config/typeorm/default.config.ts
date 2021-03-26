export default {
  name: 'default',
  type: 'mariadb',
  host: process.env.DATABASE_HOST || 'studimax-cloud.ch',
  port: 3308,
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'itK9@EqtT!3E6m@r',
  database: process.env.DATABASE_DB || 'project',
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
};
