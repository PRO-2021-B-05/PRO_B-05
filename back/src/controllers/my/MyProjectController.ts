import {
    BodyParams,
    Context,
    Controller,
    Delete,
    Get,
    PathParams,
    Post,
    Put,
    QueryParams,
    Req,
    Request
} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {getRepository} from "typeorm";
import {Student} from "../../entities/Student";
import {Project} from "../../entities/Project";
import {NotFound} from "@tsed/exceptions";
import {Status} from "@tsed/schema";
import * as uuid from "uuid";
import {User} from "../../entities/User";
import {Image} from "../../entities/Image";

@Controller('/projects')
@Authenticate()
export class MyProjectController {

    private projectRepository = getRepository(Project);
    private imageRepository = getRepository(Image);

    @Get('/')
    async listUser(
        @Req() req: Request,
        @QueryParams("offset") offset: number,
        @QueryParams("limit") limit: number,
    ) {
        const student = req.user as Student;

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
    async get(@PathParams("uuid") uuid: string,
              @Req() req: Request
    ) {
        const student = req.user as Student;
        const project = await this.projectRepository.findOne({uuid, student});

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
        @BodyParams(Project) project: Project,
        @Context() ctx: Context,
        @Req() req: Request
    ) {

        const student = req.user as Student;


        const createdProject = await this.projectRepository.create({
            uuid: uuid.v4(),
            title: project.title,
            description: project.description,
            student,
        });
        await this.projectRepository.save(createdProject);

        // TODO: Ne pas hardcoder l'url.
        ctx.response.location(`/api/v1/projects/${createdProject.uuid}`);
        return true;
    }

    @Put('/:uuid')
    @Status(204)
    async put(
        @PathParams("uuid") uuid: string,
        @BodyParams(Project) project: Project,
        @Req() req: Request
    ) {

        const student = req.user as Student;
        const existingProject = await this.projectRepository.findOne({uuid, student});
        if (!existingProject) {
            throw new NotFound("Could not find requested project");
        }

        await this.projectRepository.update({uuid}, {
            title: project.title,
            description: project.description,
        });
    }

    @Delete('/:uuid')
    @Status(200)
    async delete(@PathParams("uuid") uuid: string,
                 @Req() req: Request
    ) {

        const student = req.user as Student;
        const existingProject = await this.projectRepository.findOne({uuid, student});
        if (!existingProject) {
            throw new NotFound("Could not find requested project");
        }

        await this.projectRepository.delete({uuid});
    }


}