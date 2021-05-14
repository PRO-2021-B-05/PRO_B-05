import { BodyParams, Controller, Delete, Get, PathParams, Post, Put, QueryParams, Response } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Status } from "@tsed/schema";
import { getRepository } from "typeorm";
import { Project } from "../../entities/Project";
import { Student } from "../../entities/Student";
import * as uuid from 'uuid';
import { Image } from "../../entities/Image";

//TODO: Enlever les requêtes redondantes (effectuées déjà par MyProjectController)
@Controller('/projects')
export class ProjectController {
    private studentRepository = getRepository(Student);
    private projectRepository = getRepository(Project);
    private imageRepository = getRepository(Image);

    @Get('/')
    async listAll(
        @QueryParams("offset") offset: number,
        @QueryParams("limit") limit: number,
    ) {
        const projects = await this.projectRepository.find({
            order: { publishAt: "ASC" },
            relations: ["student"],
            skip: offset,
            take: limit,
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
    async listUser(
        @PathParams("userId") userId: string,
        @QueryParams("offset") offset: number,
        @QueryParams("limit") limit: number,
    ) {
        const student = await this.studentRepository.findOne({ uuid: userId });

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const projects = await this.projectRepository.find({
            where: { student },
            order: { publishAt: "ASC" },
            relations: ["images"],
            skip: offset,
            take: limit,
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


}
