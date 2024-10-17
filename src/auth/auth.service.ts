import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcryptjs";
import { LoginDTO } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ArtistsService } from "src/artists/artists.service";
import { PayloadType } from "src/types/payload.type";
import { User } from "src/users/user.entity";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private artistService: ArtistsService,
        private configService: ConfigService
    ){}

    getEnvVariables(){
        return{
            port: this.configService.get<number>('PORT'),
        };
    }

    async login(
        loginDTO: LoginDTO
    ): Promise<{accessToken: string}>{
        const user = await this.userService.findOne(loginDTO);
        const passwordMatched = await bcrypt.compare(
            loginDTO.password,
            user.password
        );
        if(passwordMatched){
            delete user.password;
            const payload: PayloadType = {email: user.email, userId: user.id};
            const artist = await this.artistService.findArtist(user.id);
            if(artist){
                payload.artistId = artist.id;
            }
            return {
                accessToken: this.jwtService.sign(payload),
            };
        } else {
            throw new UnauthorizedException("Password does not match!");
        }
    }

    async validateUserByApiKey(
        apiKey: string
    ): Promise<User>{
        return this.userService.findByApiKey(apiKey);
    }


}