import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, QueryParams, Response} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Returns, Status} from "@tsed/schema";
import {getRepository} from "typeorm";
import {Project} from "../../entities/Project";
import {Student} from "../../entities/Student";
import * as uuid from 'uuid';
import {Image} from "../../entities/Image";
import {Pagination} from "../../entities/Pagination";
import {deserialize} from "@tsed/json-mapper";

//TODO: Enlever les requêtes redondantes (effectuées déjà par MyProjectController)
@Controller('/projects')
export class ProjectController {
    private studentRepository = getRepository(Student);
    private projectRepository = getRepository(Project);
    private imageRepository = getRepository(Image);

    @Get('/')
    @Returns(200, Pagination).Of(Project).Groups("project.showAll", "user.show", 'image.show')
    async listAll(
        @QueryParams("offset") offset: number,
        @QueryParams("limit") limit: number,
    ) {
        const results = deserialize(
            await this.projectRepository.find({
                relations: ["student", "images", "event", "images.project"],
                order: {publishAt: "DESC"},
                skip: offset,
                take: limit,
            }), {
                type: Project,
                groups: ['project.showAll', "user.show", 'image.show']
            });
        const total = await this.projectRepository.count();
        return new Pagination<Project>({results, total, offset, limit});
    }

    /**
     uuid,
     title,
     description,
     publishAt,
     updateAt,
     thumbnailUrl: images[0]?.thumbnailUrl ?? "",
     userId: student.uuid,
     firstname: student.firstname,
     lastname: student.lastname,
     **/

    @Get('/users/:userId')
    @Returns(200, Pagination).Of(Project).Groups("project.showAll", "user.show", 'image.show')
    async listUser(
        @PathParams("userId") userId: string,
        @QueryParams("offset") offset: number,
        @QueryParams("limit") limit: number,
    ) {
        const student = await this.studentRepository.findOne({uuid: userId});

        if (!student) {
            throw new NotFound("Could not find requested user");
        }

        const results = deserialize(
            await this.projectRepository.find({
                where: {student},
                relations: ["student", "images", "event", "images.project"],
                order: {publishAt: "DESC"},
                skip: offset,
                take: limit,
            }), {
                type: Project,
                groups: ['project.showAll', "user.show", 'image.show']
            });
        const total = await this.projectRepository.count({where: {student}});
        return new Pagination<Project>({results, total, offset, limit});
    }

    @Get("/:uuid")
    @Returns(200, Project).Groups("project.show", "user.show", 'image.show')
    async get(@PathParams("uuid") uuid: string) {
        const project = await this.projectRepository.findOne({
            where: {uuid},
            relations: ["student", "images", "event", "images.project"],
        });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        return project;
    }


}
