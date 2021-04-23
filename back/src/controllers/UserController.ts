import {Controller, Get, PathParams} from "@tsed/common";
import {getRepository} from "typeorm";
import {User} from "../entities/User";
import {NotFound} from "@tsed/exceptions";

@Controller('/users')
export  class UserController{
    private userRepository = getRepository(User);

    @Get('/')
    async  listAll(){
        const users = await this.userRepository.find();
        return users.map(({ uuid }) => ({ uuid }));
    }

    @Get("/:uuid")
    async get(@PathParams("uuid") uuid: string) {
        const user = await this.userRepository.findOne({ uuid });

        if (!user) {
            throw new NotFound("Could not find requested user");
        }

        return {
            username: user.username,
            password: user.password,
            firstname: user.firstname,
            lastname: user.lastname
        };
    }


}