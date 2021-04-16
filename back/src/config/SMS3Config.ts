import {ClientOptions} from 'minio';

export default (): ClientOptions => ({
  endPoint: 's3.studimax.ch',
  region: 'ch-1',
  port: 443,
  useSSL: true,
  accessKey: process.env.S3_ACCESS_KEY ?? '',
  secretKey: process.env.S3_SECRET_KEY ?? '',
});
