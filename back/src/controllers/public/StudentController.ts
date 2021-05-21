import {BodyParams, Controller, Delete, Get, PathParams, Put, QueryParams, Req, Request} from "@tsed/common";
import {getRepository} from "typeorm";
import {User} from "../../entities/User";
import {NotFound} from "@tsed/exceptions";
import {Student} from "../../entities/Student";
import {Groups, Returns, Status} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import {OnlyAdmin} from "../../decorators/OnlyAdmin";

@Controller('/students')
export class StudentController {
    private studentRepository = getRepository(Student);

    @Get('/')
    async listAll(
        @QueryParams("offset") offset: number,
        @QueryParams("limit") limit: number,
    ) {
        const users = await this.studentRepository.find({
            skip: offset,
            take: limit,
        });

        return users.map(({ uuid, firstname, lastname }) => ({ uuid, firstname, lastname }));
    }

    @Get("/:uuid")
    async get(@PathParams("uuid") uuid: string) {
        const student = await this.studentRepository.findOne({ uuid });

        if (!student) {
            throw new NotFound("Could not find requested student");
        }

        return {
            username: student.username,
            firstname: student.firstname,
            lastname: student.lastname,
            description: student.description
        };
    }

    @Put('/:uuid')
    @Authenticate()
    @OnlyAdmin()
    @Returns(200, Student).Groups("show")
    async put(@PathParams("uuid") uuid: string, @BodyParams(Student) @Groups("update", "admin") student: Partial<Student>) {
        const existingStudent = await this.studentRepository.findOne({uuid});
        if (!existingStudent) {
            throw new NotFound("Could not find requested student");
        }
        if (student.password)
            student.password = await bcrypt.hash(student.password, 10);

        await this.studentRepository.update({uuid: existingStudent.uuid}, student);

        return deserialize(await this.studentRepository.findOne({uuid: existingStudent.uuid}), {type: Student, groups: ['show']});
    }

    @Delete('/:uuid')
    @Authenticate()
    @OnlyAdmin()
    @Status(200)
    async delete(@PathParams("uuid") uuid: string) {
        const existingEvent = await this.studentRepository.findOne({ uuid });
        if (!existingEvent) {
            throw new NotFound("Could not find requested student");
        }

        await this.studentRepository.delete({ uuid });
    }
}