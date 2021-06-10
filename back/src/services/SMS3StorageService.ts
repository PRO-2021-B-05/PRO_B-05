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

/**
 * Classe représentant un serveur de fichiers.
 */
@Injectable()
export class SMS3StorageService {
  @Configuration() private readonly configuration: Configuration;
  private client: Minio.Client;

  public $onInit(): void {
    this.client = new Minio.Client(this.configuration.sms3);
  }

  /**
   * Permet de lister tous les fichiers d'un bucket du serveur de fichiers.
   *
   * @param bucketName Le nom du bucket
   * @param prefix Le prefixe du bucket
   * @param recursive true si l'on veut parcourir récursivement tous les dossiers, sinon false
   */
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

  /**
   * Renvoie un fichier du serveur de fichiers.
   *
   * @param bucketName Le nom du bucket où chercher le fichier
   * @param name Le nom du fichier
   */
  public getFile(bucketName: string, name: string): Promise<Readable> {
    return this.client.getObject(bucketName, name);
  }

  /**
   * Ajoute un fichier dans le serveur de fichier en spécifiant son contenu.
   *
   * @param bucketName Le nom du bucket où ajouter le fichier
   * @param name Le nom du nouveau fichier
   * @param stream Le contenu du nouveau fichier
   * @param metaData Les métadonnées à associer au fichier
   */
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

  /**
   * Permet de récupérer les infos d'un fichier.
   *
   * @param bucketName Le nom du bucket où chercher
   * @param name Le nom du fichier
   */
  public fileInfo(bucketName: string, name: string): Promise<BucketItemStat> {
    return this.client.statObject(bucketName, name);
  }

  /**
   * Suppression d'un fichier.
   *
   * @param bucketName Le nom du bucket où chercher le fichier
   * @param name Le nom du fichier à supprimer
   */
  public deleteFile(bucketName: string, name: string): Promise<void> {
    return this.client.removeObject(bucketName, name);
  }

  /**
   * Suppression d'un dossier
   *
   * @param bucketName Le nom du bucket où chercher le dossier
   * @param name Le nom du dossier
   */
  public async deleteFolder(bucketName: string, name: string): Promise<void> {
    const items = await this.listFiles(bucketName, name, true);
    await Promise.allSettled(
      items.map(item => {
        return this.client.removeObject(bucketName, item.name);
      })
    );
  }

  /**
   * Génère un Url menant à la ressource demandé sur le serveur.
   *
   * @param bucketName le nom du bucket où se trouve le fichier
   * @param name le nom de la ressource
   */
  public generateURL(bucketName: string, name: string): string {
    const c = this.configuration.sms3;
    return `${c.useSSL ? 'https' : 'http'}://${c.endPoint}:${
      c.port
    }/${bucketName}/${name}`;
  }
}
