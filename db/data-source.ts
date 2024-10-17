import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Artist } from "src/artists/artist.entity";
import { Playlist } from "src/playlists/playlist.entity";
import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";


export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [
        ConfigModule
    ],
    inject: [
        ConfigService
    ],
    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: "postgres",
            host: configService.get<string>("dbHost"),
            port: configService.get<number>("dbPort"),
            username: configService.get<string>("dbUsername"),
            database: configService.get<string>("dbName"),
            password: configService.get<string>("password"),
            entities: [
                User,
                Playlist,
                Artist,
                Song
            ],
            
            //entities: ["dist/**/*.entity.js"], //*
            //*
            // The syntax entities: ['dist/**/*.entity.js'] has been utilized for entity registration, yet it is
            // incompatible with Webpack hot module reloading, necessitating manual entity registration within the
            // typeOrmAsyncConfig object. As a best practice, specifying each entity class directly in the
            // TypeORM configuration ensures clarity and reliability, especially during the development phase
            // when hot reloading is frequently used.


            synchronize: false,
            migrations: ["dist/db/migrations/*.js"],
        };
    },
};
    
export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.PASSWORD,
    entities: ["dist/**/*.entity.js"],
    synchronize: false,
    migrations: ["dist/db/migrations/*.js"],
};
    
// export const dataSourceOptions: DataSourceOptions = {
//     type: "postgres",
//     host: "localhost",
//     port: 5432,
//     username: "postgres",
//     password: "root",
//     database: "spotify-clone",
//     entities: ["dist/**/*.entity.js"], //1
//     synchronize: false, // 2
//     migrations: ["dist/db/migrations/*.js"], // 3s
// };

const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;

// 1. Now you don't need to register the entity manually. TypeORM will find the entities by itself.
// 2. When you are working with migrations you have to set the synchronize to false because our
// migration file will update the changes in the database
// 3. You have to provide the path of migration where you want to store. I chose the dist folder. I
// will run the migrations as a js file. That's why we need to build the project before running
// typeorm migrations
// 4. We will use this data source object when we generate/run the migrations with typeorm cli
