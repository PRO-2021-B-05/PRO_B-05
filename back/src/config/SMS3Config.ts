import {ClientOptions} from 'minio';

/**
 * Options de configurations du serveur de fichiers S3.
 *
 */
export default (): ClientOptions => ({
  endPoint: process.env.S3_ENDPOINT ?? 's3.studimax.ch',
  region: process.env.S3_REGION ?? 'ch-1',
  port: +(process.env.S3_PORT ?? '443'),
  useSSL: (process.env.S3_SSL ?? 'true') === 'true',
  accessKey: process.env.S3_ACCESS_KEY ?? '',
  secretKey: process.env.S3_SECRET_KEY ?? '',
});
