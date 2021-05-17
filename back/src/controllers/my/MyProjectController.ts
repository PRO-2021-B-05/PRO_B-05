import {
    BodyParams,
    Context,
    Controller,
    Delete,
    Get, MultipartFile,
    PathParams, PlatformMulterFile,
    Post,
    Put,
    QueryParams,
    Req,
    Request, Response
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
import Jimp from "jimp";
import {Inject} from "@tsed/di";
import {SMS3StorageService} from "../../services/SMS3StorageService";

@Controller('/projects')
@Authenticate()
export class MyProjectController {

    @Inject() private s3: SMS3StorageService;
    private projectRepository = getRepository(Project);
    private imageRepository = getRepository(Image);

    @Post('/')
    @Status(201)
    async post(
        @BodyParams(Project) project: Project,
        @Context() ctx: Context,
        @Req() req: Request
    ) {

        const student = req.user as Student;


        const createdProject  = await this.projectRepository.save({
            title: project.title,
            description: project.description,
            student,
        });

        // TODO: Ne pas hardcoder l'url.
        ctx.response.location(`/api/v1/my/projects/${createdProject.uuid}`);
        return createdProject.uuid;
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
        this.s3.deleteFolder("start", `${uuid}`);
    }

    //TODO: Gestion des images

    @Post('/:uuid/images')
    @Status(201)
    async postImage(
        @PathParams("uuid") projectId: string,
        @MultipartFile("file") file: PlatformMulterFile,
        @BodyParams("title") title: string,
        @BodyParams("description") description: string,
        @Req() req: Request,
        @Response() response: Response
    ) {
        const student = req.user as Student;
        const existingProject = await this.projectRepository.findOne({uuid : projectId, student});
        if (!existingProject) {
            throw new NotFound("Could not find requested project");
        }


        const createdImage = await this.imageRepository.save({
            project: existingProject,
            title: title,
            description: description,
            });

        this.s3.putFile("start", `${projectId}/${createdImage.uuid}/original`, file.buffer, {
            'Content-Type': file.mimetype,
        });

        const thumbnail = await Jimp.read(file.buffer);
        thumbnail.resize(250, Jimp.AUTO);
        const buffer = await thumbnail.getBufferAsync(Jimp.MIME_PNG);

        this.s3.putFile('start', `${projectId}/${createdImage.uuid}/thumbnail`, buffer, {
            'Content-Type': Jimp.MIME_PNG,
        });

        response.location(`/api/v1/public/projects/${projectId}/images/${createdImage.uuid}`);
    }

    @Put('/:uuid/images/:imageId')
    @Status(204)
    async putImage(
        @PathParams("uuid") projectId: string,
        @PathParams("imageId") imageId: string,
        @BodyParams(Image) image: Image,
    ) {
        const project = await this.projectRepository.findOne({ uuid: projectId });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        const existingImage = await this.imageRepository.findOne({ uuid : imageId, project : project });
        if (!existingImage) {
            throw new NotFound("Could not find requested image");
        }

        await this.imageRepository.update({ uuid : imageId }, {
            title: image.title,
            description: image.description,
        });
    }

    //TODO: Tester le delete
    @Delete('/:uuid/images/:imageId')
    @Status(200)
    async deleteImage(
        @PathParams("uuid") projectId: string,
        @PathParams("imageId") imageId: string,
    ) {
        const project = await this.projectRepository.findOne({ uuid: projectId });

        if (!project) {
            throw new NotFound("Could not find requested project");
        }

        const existingImage = await this.imageRepository.findOne({ uuid : imageId, project : project });
        if (!existingImage) {
            throw new NotFound("Could not find requested image");
        }

        await this.imageRepository.delete({ uuid : imageId });
        this.s3.deleteFolder("start", `${projectId}/${existingImage.uuid}`);
    }

}