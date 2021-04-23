import {BodyParams, Controller, Delete, Get, PathParams, Put} from "@tsed/common";
import {getRepository} from "typeorm";
import {User} from "../entities/User";
import {NotFound} from "@tsed/exceptions";
import {Student} from "../entities/Student";
import {Status} from "@tsed/schema";

@Controller('/students')
export  class StudentController{
    private studentRepository = getRepository(Student);

    @Get('/')
    async  listAll(){
        const users = await this.studentRepository.find();
        return users.map(({ uuid }) => ({ uuid }));
    }

    @Get("/:uuid")
    async get(@PathParams("uuid") uuid: string) {
        const student = await this.studentRepository.findOne({ uuid });

        if (!student) {
            throw new NotFound("Could not find requested student");
        }

        return {
            username: student.username,
            password: student.password,
            firstname: student.firstname,
            lastname: student.lastname,
            description: student.description
        };
    }

    @Put('/:uuid')
    @Status(204)
    async put(@PathParams("uuid") uuid: string, @BodyParams(Student) student: Student) {
        const existingStudent = await this.studentRepository.findOne({ uuid });
        if (!existingStudent) {
            throw new NotFound("Could not find requested student");
        }

        await this.studentRepository.update({ uuid }, {
            username: student.username,
            password: student.password,
            firstname: student.firstname,
            lastname: student.lastname,
            description: student.description
        });
    }

    @Delete('/:uuid')
    @Status(200)
    async delete(@PathParams("uuid") uuid: string) {
        const existingEvent = await this.studentRepository.findOne({ uuid });
        if (!existingEvent) {
            throw new NotFound("Could not find requested student");
        }

        await this.studentRepository.delete({ uuid });
    }

}