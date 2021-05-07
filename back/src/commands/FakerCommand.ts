import {Command, CommandProvider, QuestionOptions} from "@tsed/cli-core";
import {Student} from "../entities/Student";
import faker from "faker";
import bcrypt from "bcrypt";
import {createConnection} from "typeorm";
import {Connection} from "typeorm";
import defaultConnection from "../config/typeorm/defaultConnection";

export interface FakerCommandContext {
}

@Command({
    name: "faker-command",
    description: "Populate the database with fake data",
    args: {},
    options: {},
    allowUnknownOption: false
})
export class FakerCommand implements CommandProvider {

    private connection: Promise<Connection>;
    constructor() {
        this.connection = createConnection(defaultConnection());
    }
    /**
     *  Ask questions with Inquirer. Return an empty array or don't implement the method to skip this step
     */
    async $prompt(initialOptions: Partial<FakerCommandContext>): Promise<QuestionOptions> {
        return [];
    }

    /**
     * This method is called after the $prompt to create / map inputs to a proper context for the next step
     */
    $mapContext(ctx: Partial<FakerCommandContext>): FakerCommandContext {
        return {
            ...ctx
            // map something, based on ctx
        };
    }

    /**
     *  This step run your tasks with Listr module
     */
    async $exec(ctx: FakerCommandContext): Promise<any> {
        return [
            {
                title: "create users",
                task: () => this.createUsers()
            }
        ];
    }

    private async  createUsers() {
      const connection = await this.connection;
      const  studentRepository = connection.getRepository(Student);
        for (let i = 0; i < 100; ++i){
            const student = new Student();
            student.firstname = faker.name.firstName();
            student.lastname = faker.name.lastName();
            student.username = faker.internet.userName(student.firstname, student.lastname);
            student.description = faker.lorem.paragraph();
            student.password = await bcrypt.hash("password", 10);
            await studentRepository.save(student);
        }
    }
}
