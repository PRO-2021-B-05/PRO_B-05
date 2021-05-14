import {Controller, Get, Req, Request} from "@tsed/common";
import {Authenticate} from "@tsed/passport";

@Controller('/profile')
@Authenticate()
export class MyProfileController {

    @Get('/')
    async profile(@Req() req: Request) {
        return req.user;
    }


}