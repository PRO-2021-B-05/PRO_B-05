import {
  BodyParams,
  Controller,
  Delete,
  Get,
  Inject,
  MultipartFile,
  PathParams,
  PlatformMulterFile,
  Post,
  Put,
  QueryParams,
  Response,
} from '@tsed/common';
import {NotFound} from '@tsed/exceptions';
import {deserialize} from '@tsed/json-mapper';
import {Groups, Returns, Status} from '@tsed/schema';
import Jimp from 'jimp';
import {getRepository} from 'typeorm';

import {Image} from '../../entities/Image';
import {Pagination} from '../../entities/Pagination';
import {Project} from '../../entities/Project';
import {SMS3StorageService} from '../../services/SMS3StorageService';

/**
 * Contrôleur permettant d'accèder aux images appartenant à un projet.
 *
 */
@Controller('/projects/:projectId/images')
export class ImageController {
  /**
   * Accès au stockage des images.
   *
   */
  @Inject()
  private s3: SMS3StorageService;

  /**
   * Accès à la table des projets dans la base de données.
   *
   */
  private projectRepository = getRepository(Project);

  /**
   * Accès à la table des métadonnées des images dans la base de données.
   *
   */
  private imageRepository = getRepository(Image);

  /**
   * Permet de lire la liste de toutes les images appartenant à un projet.
   *
   * @param projectId L'identifiant du projet.
   * @param offset Le numéro de la première image de la liste.
   * @param limit Le nombre d'images à renvoyer dans la liste.
   * @returns La liste des images du projet à partir du numéro donné.
   *
   */
  @Get('/')
  @(Returns(200, Pagination).Of(Image).Groups('image.show'))
  async listAll(
    @PathParams('projectId') projectId: string,
    @QueryParams('offset') offset: number,
    @QueryParams('limit') limit: number
  ) {
    const project = await this.projectRepository.findOne({uuid: projectId});

    if (!project) {
      throw new NotFound('Could not find requested project');
    }

    const results = deserialize(
      await this.imageRepository.find({
        where: {project},
        relations: ['project'],
        skip: offset,
        take: limit,
      }),
      {
        type: Image,
        groups: ['image.show'],
      }
    );
    const total = await this.imageRepository.count({where: {project}});
    return new Pagination<Image>({results, total, offset, limit});
  }

  /**
   * Permet de lire les informations d'une image appartenant à un projet.
   *
   * @param projectId L'identifiant unique du projet.
   * @param uuid L'identifiant unique de l'image.
   * @returns Les informations de l'image demandée.
   *
   */
  @Get('/:uuid')
  @(Returns(200, Image).Groups('image.show'))
  async get(
    @PathParams('projectId') projectId: string,
    @PathParams('uuid') uuid: string
  ) {
    const project = await this.projectRepository.findOne({uuid: projectId});

    if (!project) {
      throw new NotFound('Could not find requested project');
    }

    const image = await this.imageRepository.findOne({
      where: {uuid},
      relations: ['project'],
    });

    if (!image) {
      throw new NotFound('Could not find requested image');
    }

    return image;
  }
}
