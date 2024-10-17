//auth.module.ts
import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JWTStrategy } from '../common/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
// import { authConstants } from "./constants/auth.constants";
import { ArtistsModule } from "src/artists/artists.module";
import { ApiKeyStrategy } from "./apiKeyStrategy";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        PassportModule,
        UsersModule,
        ArtistsModule,
        JwtModule.registerAsync({ //*
            imports: [
                ConfigModule
            ],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('secret'),
                signOptions: {
                    expiresIn: '1d'
                },
            }),
            inject: [
                ConfigService
            ],
        })

        // JwtModule.register({
        //     secret: authConstants.secret,
        //     signOptions: {
        //         expiresIn: '1d'
        //     },
        // }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JWTStrategy,
        ApiKeyStrategy
    ],
    exports: [AuthService],
})

export class AuthModule {


}

//*
// The registerAsync method will return the DynamicModule. In Nest.js, a dynamic module is a
// feature that allows you to dynamically configure and register modules at runtime based on dynamic
// conditions or external factors. It provides a way to encapsulate complex configuration logic and
// allows modules to be created and registered programmatically.
// Dynamic modules are useful when you have modules that require some dynamic configuration or
// when you want to conditionally load modules based on runtime conditions or variables.
