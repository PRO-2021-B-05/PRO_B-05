import {BodyParams, Controller, Get, PathParams, Put, Req, Request} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {Student} from "../../entities/Student";
import {NotFound} from "@tsed/exceptions";
import {Groups, RequiredGroups, Returns, string} from "@tsed/schema";
import {getRepository} from "typeorm";

@Controller('/profile')
@Authenticate()
export class MyProfileController {

    private studentRepository = getRepository(Student);

    @Get('/')
    async profile(@Req() req: Request) {
        return req.user;
    }

    @Put('/')
    @Returns(200, Student).Groups("updateStudent")
    async put(@Req() req: Request,  @BodyParams(Student) @Groups("updateStudent") student: Partial<Student>) {

       const existingStudent = req.user as Student;
        if (!existingStudent) {
            throw new NotFound("Could not find requested student");
        }

        await this.studentRepository.update({ uuid:existingStudent.uuid }, student);
        return await this.studentRepository.findOne({ uuid:existingStudent.uuid });
    }

}