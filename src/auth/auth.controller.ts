import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "src/users/dto/create-user.dto";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";


@Controller("auth")
@ApiTags("auth")
export class AuthController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {}

    @Get('test')
    testEnv(){
        return this.authService.getEnvVariables();
    }

    @ApiOperation({
        summary: "Register new user"
    })
    @ApiResponse({
        status: 201,
        description: "It will return the user in the response",
    })

    @Post("signup")
    signup(
        @Body()
        userDTO: CreateUserDTO
    ): Promise<User> {
        return this.userService.create(userDTO);
    }

    @ApiOperation({
        summary: "Login user"
    })
    @ApiResponse({
        status: 200,
        description: "It will give you the access_token in the response"
    })
    @Post('login')
    login(
        @Body()
        loginDTO: LoginDTO,
    ){
        return this.authService.login(loginDTO);
    }

    @Get('profile')
    @UseGuards(AuthGuard('bearer'))
    getProfile(
        @Req()
        req
    ){
        delete req.user.password;
        return{
            msg: 'authenticated with API key!',
            user: req.user,
        }
    }

}