import {Controller, Get, PathParams, QueryParams, UseBefore, UseBeforeEach} from "@tsed/common";
import {getRepository} from "typeorm";
import {User} from "../../entities/User";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {OnlyAdmin} from "../../decorators/OnlyAdmin";
import {OnlyAdminMiddleware} from "../../middlewares/OnlyAdminMiddleware";

@Controller('/users')
@Authenticate()
@OnlyAdmin()
//@UseBeforeEach(OnlyAdminMiddleware)
export class UserController {
    private userRepository = getRepository(User);

    @Get('/')
    async listAll(
        @QueryParams("offset") offset: number,
        @QueryParams("limit") limit: number,
    ) {
        const users = await this.userRepository.find({
            skip: offset,
            take: limit,
        });

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