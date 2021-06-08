import {
  BodyParams,
  Context,
  Controller,
  Delete,
  MultipartFile,
  PathParams,
  PlatformMulterFile,
  Post,
  Put,
  Req,
  Request,
  Response,
} from '@tsed/common';
import { Inject } from '@tsed/di';
import { NotFound } from '@tsed/exceptions';
import { Authenticate } from '@tsed/passport';
import { Groups, Returns, Status } from '@tsed/schema';
import Jimp from 'jimp';
import { getRepository } from 'typeorm';

import { Image } from '../../entities/Image';
import { Project } from '../../entities/Project';
import { Student } from '../../entities/Student';
import { SMS3StorageService } from '../../services/SMS3StorageService';

/**
 * Contrôleur permettant à un étudiant connecté de modifier ses projets.
 *
 */
@Controller('/projects')
@Authenticate()
export class MyProjectController {
  /**
   * Accès au système de stockage des images.
   *
   */
  @Inject() private s3: SMS3StorageService;

  /**
   * Accès à la table des projets dans la base de données.
   *
   */
  private projectRepository = getRepository(Project);

  /**
   * Accès à la table des métadonnées sur les images dans la base de données.
   *
   */
  private imageRepository = getRepository(Image);

  /**
   * Permet de créer un nouveau projet appartenant à l'étudiant connecté ayant
   * formulé la requête.
   *
   * @param ctx Le contexte contenant la réponse du serveur.
   * @param req La requête formulée par le client.
   * @param project Les informations du projet à créer.
   * @returns L'identifiant unique du nouveau projet créé.
   *
   */
  @Post('/')
  @Returns(201, String)
  async post(
    @Context() ctx: Context,
    @Req() req: Request,
    @BodyParams(Project) @Groups('project.create') project: Project
  ) {
    const student = req.user as Student;

    const createdProject = await this.projectRepository.save({
      ...project,
      student,
    });

    // TODO: Ne pas hardcoder l'url.
    ctx.response.location(`/api/v1/my/projects/${createdProject.uuid}`);
    return createdProject.uuid;
  }

  /**
   * Permet de modifier un projet existant.
   *
   * @param uuid L'identifiant unique du projet à modifier.
   * @param project Les informations du projet à modifier.
   * @param req Le requête formulée par le client.
   * @returns Les informations du projet après modification.
   *
   */
  @Put('/:uuid')
  @(Returns(204, Project).Groups('project.show', 'user.show', 'image.show'))
  async put(
    @PathParams('uuid') uuid: string,
    @BodyParams(Project) @Groups('project.update') project: Project,
    @Req() req: Request
  ) {
    const student = req.user as Student;
    const existingProject = await this.projectRepository.findOne({
      uuid,
      student,
    });
    if (!existingProject) {
      throw new NotFound('Could not find requested project');
    }

    await this.projectRepository.update({ uuid }, project);
    return this.projectRepository.findOne({
      where: { uuid },
      relations: ['student', 'images', 'event', 'images.project'],
    });
  }

  /**
   * Permet de supprimer un projet.
   *
   * @param uuid L'identifiant unique du projet à supprimer.
   * @param req La requête formulée par le client.
   *
   */
  @Delete('/:uuid')
  @Status(200)
  async delete(@PathParams('uuid') uuid: string, @Req() req: Request) {
    const student = req.user as Student;
    const existingProject = await this.projectRepository.findOne({
      uuid,
      student,
    });
    if (!existingProject) {
      throw new NotFound('Could not find requested project');
    }

    await this.projectRepository.delete({ uuid });
    this.s3.deleteFolder('start', `${uuid}`);
  }

  /**
   * Permet d'ajouter une nouvelle image à un projet.
   *
   * @param projectId L'identifiant unique du projet.
   * @param file L'image à ajouter.
   * @param title Le titre de l'image.
   * @param description La description de l'image.
   * @param req La requête formulée par le client.
   * @param response La réponse du serveur.
   *
   */
  @Post('/:uuid/images')
  @Status(201)
  async postImage(
    @PathParams('uuid') projectId: string,
    @MultipartFile('file') file: PlatformMulterFile,
    @BodyParams('title') title: string,
    @BodyParams('description') description: string,
    @Req() req: Request,
    @Response() response: Response
  ) {
    const student = req.user as Student;
    const existingProject = await this.projectRepository.findOne({
      uuid: projectId,
      student,
    });
    if (!existingProject) {
      throw new NotFound('Could not find requested project');
    }

    const createdImage = await this.imageRepository.save({
      project: existingProject,
      title: title,
      description: description,
    });

    this.s3.putFile(
      'start',
      `${projectId}/${createdImage.uuid}/original`,
      file.buffer,
      {
        'Content-Type': file.mimetype,
      }
    );

    const thumbnail = await Jimp.read(file.buffer);
    thumbnail.resize(250, Jimp.AUTO);
    const buffer = await thumbnail.getBufferAsync(Jimp.MIME_PNG);

    this.s3.putFile(
      'start',
      `${projectId}/${createdImage.uuid}/thumbnail`,
      buffer,
      {
        'Content-Type': Jimp.MIME_PNG,
      }
    );

    response.location(
      `/api/v1/public/projects/${projectId}/images/${createdImage.uuid}`
    );
  }

  /**
   * Permet de modifier une image existante appartenant à un projet.
   *
   * @param projectId L'identifiant du projet.
   * @param imageId L'identifiant de l'image.
   * @param image Les informations de l'image à modifier.
   *
   */
  @Put('/:uuid/images/:imageId')
  @Status(204)
  async putImage(
    @PathParams('uuid') projectId: string,
    @PathParams('imageId') imageId: string,
    @BodyParams(Image) image: Image
  ) {
    const project = await this.projectRepository.findOne({ uuid: projectId });

    if (!project) {
      throw new NotFound('Could not find requested project');
    }

    const existingImage = await this.imageRepository.findOne({
      uuid: imageId,
      project: project,
    });
    if (!existingImage) {
      throw new NotFound('Could not find requested image');
    }

    await this.imageRepository.update(
      { uuid: imageId },
      {
        title: image.title,
        description: image.description,
      }
    );
  }

  /**
   * Permet de supprimer une image existante appartenant à un projet.
   *
   * @param projectId L'identifiant unique du projet.
   * @param imageId L'identifiant unique de l'image.
   *
   */
  @Delete('/:uuid/images/:imageId')
  @Status(200)
  async deleteImage(
    @PathParams('uuid') projectId: string,
    @PathParams('imageId') imageId: string
  ) {
    const project = await this.projectRepository.findOne({ uuid: projectId });

    if (!project) {
      throw new NotFound('Could not find requested project');
    }

    const existingImage = await this.imageRepository.findOne({
      uuid: imageId,
      project: project,
    });
    if (!existingImage) {
      throw new NotFound('Could not find requested image');
    }

    await this.imageRepository.delete({ uuid: imageId });
    this.s3.deleteFolder('start', `${projectId}/${existingImage.uuid}`);
  }
}
