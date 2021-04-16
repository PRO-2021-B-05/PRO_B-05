import { BodyParams, Context, Controller, Delete, Get, MultipartFile, PathParams, PlatformMulterFile, Post, Put, Req } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Status } from "@tsed/schema";
import { getRepository } from "typeorm";
import { Image } from "../entities/Image";
import { Project } from "../entities/Project";
import { Student } from "../entities/Student";

@Controller('/users/:userId/projects/:projectId/images')
export class ImageController {
    private studentRepository = getRepository(Student);
    private projectRepository = getRepository(Project);
    private imageRepository = getRepository(Image);

    @Get('/')
    async listAll(
        @PathParams("userId") userId: string,
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
        return images.map(({ uuid, title }) => ({
            uuid,
            title,
            url: "",
            thumbnailUrl: "",
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
            url: "",
        };
    }

    @Post('/')
    @Status(201)
    async post(
        @PathParams("userId") userId: string,
        @PathParams("projectId") projectId: string,
        @BodyParams(Image) image: Image,
        @MultipartFile("file") file: PlatformMulterFile,
        @Context() ctx: Context,
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
            title: image.title,
            description: image.description,
            project,
        });

        // TODO: Upload le fichier sur S3.

        // TODO: Ne pas hardcoder l'url.
        ctx.response.location(`/api/v1/users/${userId}/projects/${projectId}/images/${createdImage.uuid}`);
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
