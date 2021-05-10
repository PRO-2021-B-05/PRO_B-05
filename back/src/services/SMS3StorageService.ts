import {Configuration} from '@tsed/common';
import {Injectable} from '@tsed/di';
import * as Minio from 'minio';
import {
  BucketItem,
  BucketItemStat,
  ClientOptions,
  ItemBucketMetadata,
} from 'minio';
import {Readable, Readable as ReadableStream} from 'stream';

declare global {
  namespace TsED {
    interface Configuration {
      sms3: ClientOptions;
    }
  }
}

@Injectable()
export class SMS3StorageService {
  @Configuration()
  private readonly configuration: Configuration;
  private client: Minio.Client;

  public $onInit(): void {
    this.client = new Minio.Client(this.configuration.sms3);
  }

  public listFiles(
    bucketName: string,
    prefix?: string,
    recursive?: boolean
  ): Promise<BucketItem[]> {
    return new Promise((resolve, reject) => {
      const list: BucketItem[] = [];
      this.client
        .listObjectsV2(bucketName, prefix, recursive)
        .on('data', data => {
          list.push(data);
        })
        .on('error', e => {
          reject(e);
        })
        .on('end', () => resolve(list));
    });
  }

  public getFile(bucketName: string, name: string): Promise<Readable> {
    return this.client.getObject(bucketName, name);
  }

  public putFile(
    bucketName: string,
    name: string,
    stream: ReadableStream | Buffer | string,
    metaData?: ItemBucketMetadata
  ): Promise<string> {
    return this.client.putObject(bucketName, name, stream, metaData);
  }

  public putFileFromFile(
    bucketName: string,
    name: string,
    filePath: string,
    metaData?: ItemBucketMetadata
  ): Promise<string> {
    return this.client.fPutObject(bucketName, name, filePath, metaData ?? {});
  }

  public fileInfo(bucketName: string, name: string): Promise<BucketItemStat> {
    return this.client.statObject(bucketName, name);
  }

  public deleteFile(bucketName: string, name: string): Promise<void> {
    return this.client.removeObject(bucketName, name);
  }
}
