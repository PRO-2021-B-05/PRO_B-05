import { BodyParams, Context, Controller, Delete, Get, PathParams, Post, Put, Req } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Status } from "@tsed/schema";
import { getRepository } from "typeorm";
import { Project } from "../entities/Project";
import { Student } from "../entities/Student";
import * as uuid from 'uuid';

@Controller('/users/:userId/projects')
export class ProjectController {
    private studentRepository = getRepository(Student);
    private projectRepository = getRepository(Project);

    @Get('/')
    async listAll(@PathParams("userId") userId: string) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const projects = await this.projectRepository.find({ student });
        return projects.map(({ uuid, title, description, publishAt, updateAt }) => ({
            uuid,
            title,
            description,
            publishAt,
            updateAt,
            thumbnailUrl: "",
        }));
    }

    @Get("/:uuid")
    async get(@PathParams("userId") userId: string, @PathParams("uuid") uuid: string) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const project = await this.projectRepository.findOne({ uuid });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        return {
            title: project.title,
            description: project.description,
            publishAt: project.publishAt,
            updateAt: project.updateAt,
        };
    }

    @Post('/')
    @Status(201)
    async post(
        @PathParams("userId") userId: string,
        @BodyParams(Project) project: Project,
        @Context() ctx: Context,
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

        // TODO: Ne pas hardcoder l'url.
        ctx.response.location(`/api/v1/users/${userId}/projects/${createdProject.uuid}`);
    }

    @Put('/:uuid')
    @Status(204)
    async put(
        @PathParams("userId") userId: string,
        @PathParams("uuid") uuid: string,
        @BodyParams(Project) project: Project) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

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
    async delete(@PathParams("userId") userId: string, @PathParams("uuid") uuid: string) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const existingProject = await this.projectRepository.findOne({ uuid });
        if (!existingProject) {
            throw new NotFound("Could not find requested project");
        }

        await this.projectRepository.delete({ uuid });
    }
}
