import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed.service';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  //setting up swagger
  const config = new DocumentBuilder()
    .setTitle("Spotify Clone")
    .setDescription("The Spotify Clone API documentation")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT Token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // 1. The DocumentBuilder is utilized to configure the title, description, and version of the API
  // documentation.
  // 2. This document is then created with the help of the SwaggerModule, which is specific to
  // NestJS for API design and testing.
  // 3. Subsequently, the Swagger document is hosted at the /api endpoint, making it accessible
  // via http://localhost:3000/api, offering a visual interface for interacting with the API. As
  // a best practice, maintaining up-to-date and comprehensive Swagger documentation ensures
  // that APIs are understandable and usable, aiding in both development and API consumption.

  const seedService = app.get(SeedService);
  const configService = app.get(ConfigService);
  await seedService.seed();
  await app.listen(configService.get<number>("port"));

  if(module.hot){
    module.hot.accept();
    module.hot.dispose(() =>
      app.close()
    );
  }

}
bootstrap();
