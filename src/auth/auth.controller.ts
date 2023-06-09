import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() body) {
    Logger.log(body);
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('Set-Cookie', 'Authentication=; HttpOnly; Path=/; Max-Age=0');
    return { message: 'Logged out successfully' };
  }
}
