import { BodyParams, Context, Controller, Delete, Get, Inject, MultipartFile, PathParams, PlatformMulterFile, Post, Put, Req, Response } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Status } from "@tsed/schema";
import { getRepository } from "typeorm";
import { Image } from "../entities/Image";
import { Project } from "../entities/Project";
import { Student } from "../entities/Student";
import * as uuid from 'uuid';
import { SMS3StorageService } from "../services/SMS3StorageService";
import Jimp from 'jimp';

@Controller('/users/:userId/projects/:projectId/images')
export class ImageController {
    @Inject()
    private s3: SMS3StorageService;
    private studentRepository = getRepository(Student);
    private projectRepository = getRepository(Project);
    private imageRepository = getRepository(Image);

    @Get('/')
    async listAll(
        @PathParams("projectId") projectId: string,
    ) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const project = await this.projectRepository.findOne({ uuid: projectId });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        const images = await this.imageRepository.find({ project });
        return images.map(({ uuid, title, url, thumbnailUrl }) => ({
            uuid,
            title,
            url,
            thumbnailUrl,
        }));
    }

    @Get("/:uuid")
    async get(
        @PathParams("userId") userId: string,
        @PathParams("projectId") projectId: string,
        @PathParams("uuid") uuid: string,
    ) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const project = await this.projectRepository.findOne({ uuid: projectId });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        const image = await this.imageRepository.findOne({ uuid });

        if (!image) {
            throw new NotFound("Could not find requested image");
        }

        return {
            title: image.title,
            description: image.description,
            url: image.url,
        };
    }

    @Post('/')
    @Status(201)
    async post(
        @PathParams("userId") userId: string,
        @PathParams("projectId") projectId: string,
        @MultipartFile("file") file: PlatformMulterFile,
        @Response() response: Response,
    ) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const project = await this.projectRepository.findOne({ uuid: projectId });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        const createdImage = await this.imageRepository.create({
            uuid: uuid.v4(),
            title: "",
            description: "",
            project,
        });
        await this.imageRepository.save(createdImage);

        // TODO: Supporter l'upload sur S3.
        /*
        this.s3.putFile("start", `${projectId}/${createdImage.uuid}`, file.buffer, {
            'Content-Type': file.mimetype,
        });

        const thumbnail = await Jimp.read(file.buffer)
        thumbnail.resize(250, Jimp.AUTO);
        const buffer = await thumbnail.getBufferAsync(Jimp.MIME_PNG);

        this.s3.putFile('start', `${projectId}/${createdImage.uuid}-thumbnail`, buffer, {
            'Content-Type': Jimp.MIME_PNG,
        });
        */

        // TODO: Ne pas hardcoder l'url.
        response.location(`/api/v1/users/${userId}/projects/${projectId}/images/${createdImage.uuid}`);
    }

    @Put('/:uuid')
    @Status(204)
    async put(
        @PathParams("userId") userId: string,
        @PathParams("projectId") projectId: string,
        @PathParams("uuid") uuid: string,
        @BodyParams(Image) image: Image,
    ) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const project = await this.projectRepository.findOne({ uuid: projectId });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        const existingImage = await this.projectRepository.findOne({ uuid });
        if (!existingImage) {
            throw new NotFound("Could not find requested image");
        }

        await this.imageRepository.update({ uuid }, {
            title: image.title,
            description: image.description,
        });
    }

    @Delete('/:uuid')
    @Status(200)
    async delete(
        @PathParams("userId") userId: string,
        @PathParams("projectId") projectId: string,
        @PathParams("uuid") uuid: string,
    ) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const project = await this.projectRepository.findOne({ uuid: projectId });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        const existingImage = await this.imageRepository.findOne({ uuid });
        if (!existingImage) {
            throw new NotFound("Could not find requested project");
        }

        await this.imageRepository.delete({ uuid });
    }
}
