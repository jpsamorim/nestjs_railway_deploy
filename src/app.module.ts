import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerModule } from './common/middleware/logger/logger.module';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PlaylistModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';


const devConfig = {
  port: 3000
};

const proConfig = {
  port: 400
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ConfigModule.forRoot({
      envFilePath: [
        `${process.cwd()}/.env.${process.env.NODE_ENV}` // process.cwd() gives you the current working directory
      ],
      isGlobal: true, // if not true, As with any provider, we need to import it's containing module - the
      // ConfigModule - into the module that will use it
      load: [
        configuration
      ],
      validate: validate,
      
    }),
    SongsModule,
    LoggerModule,
    PlaylistModule,
    UsersModule,
    AuthModule,
    ArtistsModule,
    SeedModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: DevConfigService,
      useClass: DevConfigService,
    },
    {
      provide: 'CONFIG',
      useFactory: () => {
        return process.env.NODE_ENV === 'development' ? devConfig: proConfig;
      },
    },
  ],
})

export class AppModule implements NestModule {

  constructor(private dataSource: DataSource){
    console.log(dataSource.driver.database);
  }

  configure(consumer: MiddlewareConsumer){
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('songs');
  }

}
