import {Controller, Get} from "@tsed/common";
import {getRepository} from "typeorm";
import {Student} from "../entities/Student";
import faker from "faker";
import bcrypt from "bcrypt";
import {Project} from "../entities/Project";

@Controller('/faker')
export class FakerController{
    private studentRepository = getRepository(Student);
    private projectRepository = getRepository(Project);
    @Get('/students')
    async populateDbStudents(){
        for (let i = 0; i < 100; ++i){
            const student = new Student();
            student.firstname = faker.name.firstName();
            student.lastname = faker.name.lastName();
            student.username = faker.internet.userName(student.firstname, student.lastname);
            student.description = faker.lorem.paragraph(255);
            student.password = await bcrypt.hash("password", 10);
            await this.studentRepository.save(student);
        }
    }

    @Get('/projects')
    async populateDbProjects(){
        const students = await this.studentRepository.find();
        for (let i = 0; i < 100; ++i){
            const project = new Project();
            project.title = faker.lorem.paragraph(1);
            project.description = faker.lorem.paragraph(255);
            project.student = students[Math.floor(Math.random() * students.length)];
            await this.projectRepository.save(project);
        }
    }
}