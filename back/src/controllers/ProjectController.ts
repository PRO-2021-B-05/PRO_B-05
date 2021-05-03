import { BodyParams, Controller, Delete, Get, PathParams, Post, Put, Response } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Status } from "@tsed/schema";
import { getRepository } from "typeorm";
import { Project } from "../entities/Project";
import { Student } from "../entities/Student";
import * as uuid from 'uuid';
import { Image } from "../entities/Image";

@Controller('/projects')
export class ProjectController {
    private studentRepository = getRepository(Student);
    private projectRepository = getRepository(Project);
    private imageRepository = getRepository(Image);

    @Get('/')
    async listAll() {
        const projects = await this.projectRepository.find({
            order: { publishAt: "ASC" },
            relations: ["student"],
        });
        return Promise.all(projects.map(async (project) => {
            const { uuid, title, description, publishAt, updateAt, student } = project;
            const images = await this.imageRepository.find({
                where: { project },
                relations: ["project"],
            });

            return {
                uuid,
                title,
                description,
                publishAt,
                updateAt,
                thumbnailUrl: images[0]?.thumbnailUrl ?? "",
                userId: student.uuid,
                firstname: student.firstname,
                lastname: student.lastname,
            };
        }));
    }

    @Get('/users/:userId')
    async listUser(@PathParams("userId") userId: string) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const projects = await this.projectRepository.find({
            where: { student },
            order: { publishAt: "ASC" },
            relations: ["images"],
        });
        return Promise.all(projects.map(async (project) => {
            const { uuid, title, description, publishAt, updateAt } = project;
            const images = await this.imageRepository.find({
                where: { project },
                relations: ["project"],
            });

            return {
                uuid,
                title,
                description,
                publishAt,
                updateAt,
                thumbnailUrl: images[0]?.thumbnailUrl ?? "",
            };
        }));
    }

    @Get("/:uuid")
    async get(@PathParams("uuid") uuid: string) {
        const project = await this.projectRepository.findOne({
            where: { uuid },
            relations: ["student"],
        });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        return {
            title: project.title,
            description: project.description,
            publishAt: project.publishAt,
            updateAt: project.updateAt,
            userId: project.student.uuid,
            firstname: project.student.firstname,
            lastname: project.student.lastname,
        };
    }

    @Post('/users/:userId')
    @Status(201)
    async post(
        @PathParams("userId") userId: string,
        @BodyParams(Project) project: Project,
        @Response() response: Response,
    ) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const createdProject = await this.projectRepository.create({
            uuid: uuid.v4(),
            title: project.title,
            description: project.description,
            student,
        });
        await this.projectRepository.save(createdProject);

        response.location(`/api/v1/projects/${createdProject.uuid}`);
    }

    @Put('/:uuid')
    @Status(204)
    async put(
        @PathParams("uuid") uuid: string,
        @BodyParams(Project) project: Project,
    ) {
        const existingProject = await this.projectRepository.findOne({ uuid });
        if (!existingProject) {
            throw new NotFound("Could not find requested project");
        }

        await this.projectRepository.update({ uuid }, {
            title: project.title,
            description: project.description,
        });
    }

    @Delete('/:uuid')
    @Status(200)
    async delete(@PathParams("uuid") uuid: string) {
        const existingProject = await this.projectRepository.findOne({ uuid });
        if (!existingProject) {
            throw new NotFound("Could not find requested project");
        }

        await this.projectRepository.delete({ uuid });
    }
}
