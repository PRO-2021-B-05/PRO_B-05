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

@Controller('/projects/:projectId/images')
export class ImageController {
  @Inject()
  private s3: SMS3StorageService;
  private projectRepository = getRepository(Project);
  private imageRepository = getRepository(Image);

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

  @Post('/')
  @(Returns(201, Image).Groups('image.show'))
  async post(
    @PathParams('projectId') projectId: string,
    @MultipartFile('file') file: PlatformMulterFile,
    @BodyParams('title', String) title: string,
    @BodyParams('description', String) description: string,
    @Response() response: Response
  ) {
    const project = await this.projectRepository.findOne({uuid: projectId});

    if (!project) {
      throw new NotFound('Could not find requested project');
    }

    const createdImage = await this.imageRepository.save({
      title: title ?? '',
      description: description ?? '',
      project,
    });

    this.s3.putFile('start', `${projectId}/${createdImage.uuid}`, file.buffer, {
      'Content-Type': file.mimetype,
    });

    const thumbnail = await Jimp.read(file.buffer);
    thumbnail.resize(250, Jimp.AUTO);
    const buffer = await thumbnail.getBufferAsync(Jimp.MIME_PNG);

    this.s3.putFile(
      'start',
      `${projectId}/${createdImage.uuid}-thumbnail`,
      buffer,
      {
        'Content-Type': Jimp.MIME_PNG,
      }
    );

    response.location(
      `/api/v1/public/projects/${projectId}/images/${createdImage.uuid}`
    );

    return deserialize(
      await this.imageRepository.findOne(
        {uuid: createdImage.uuid},
        {relations: ['project']}
      ),
      {
        type: Image,
        groups: ['image.show'],
      }
    );
  }

  @Put('/:uuid')
  @(Returns(204, Image).Groups('image.show'))
  async put(
    @PathParams('projectId') projectId: string,
    @PathParams('uuid') uuid: string,
    @BodyParams(Image) @Groups('image.update') image: Image
  ) {
    const project = await this.projectRepository.findOne({uuid: projectId});

    if (!project) {
      throw new NotFound('Could not find requested project');
    }

    const existingImage = await this.imageRepository.findOne({uuid});
    if (!existingImage) {
      throw new NotFound('Could not find requested image');
    }

    await this.imageRepository.update({uuid}, image);
    return deserialize(
      await this.imageRepository.findOne(
        {uuid: existingImage.uuid},
        {relations: ['project']}
      ),
      {
        type: Image,
        groups: ['image.show'],
      }
    );
  }

  @Delete('/:uuid')
  @Status(200)
  async delete(
    @PathParams('projectId') projectId: string,
    @PathParams('uuid') uuid: string
  ) {
    const project = await this.projectRepository.findOne({uuid: projectId});

    if (!project) {
      throw new NotFound('Could not find requested project');
    }

    const existingImage = await this.imageRepository.findOne({uuid});
    if (!existingImage) {
      throw new NotFound('Could not find requested image');
    }

    await this.imageRepository.delete({uuid});
  }
}
