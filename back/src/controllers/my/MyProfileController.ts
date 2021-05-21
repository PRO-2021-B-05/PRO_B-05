import {BodyParams, Controller, Get, PathParams, Put, Req, Request} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {Student} from "../../entities/Student";
import {NotFound} from "@tsed/exceptions";
import {Groups, RequiredGroups, Returns, string} from "@tsed/schema";
import {getRepository} from "typeorm";
import {deserialize} from "@tsed/json-mapper";

@Controller('/profile')
@Authenticate()
export class MyProfileController {

    private studentRepository = getRepository(Student);

    @Get('/')
    @Returns(200, Student).Groups("show")
    async profile(@Req() req: Request) {
        const student = await this.studentRepository.findOne({uuid: (req.user as Student).uuid});
        if (!student) {
            throw new NotFound("Could not find requested student");
        }
        return deserialize(student, {type: Student, groups: ['show']});
    }

    @Put('/')
    @Returns(200, Student).Groups("show")
    async put(@Req() req: Request, @BodyParams(Student) @Groups("update") student: Partial<Student>) {

        const existingStudent = req.user as Student;
        if (!existingStudent) {
            throw new NotFound("Could not find requested student");
        }

        await this.studentRepository.update({uuid: existingStudent.uuid}, student);
        return deserialize(await this.studentRepository.findOne({uuid: existingStudent.uuid}), {type: Student, groups: ['show']});
    }

}