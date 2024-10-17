import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get('profile')
  @ApiBearerAuth("JWT-auth")
  // The @ApiBearerAuth decorator has been applied to getProfile within AppController,
  // designating it as a protected route that returns the user profile in the response. In NestJS, securing
  // routes with decorators aligns with the framework's philosophy of declarative programming,
  // enhancing readability and security - a practice in line with advanced software design principles.

  @UseGuards(JwtAuthGuard)
  getProfile(
    @Req()
    req,
  ) {
    return req.user;
  }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
