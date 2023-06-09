import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Request,
  UseGuards,
  BadRequestException,
  Param,
  Get,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    if (!(await this.userService.findByEmail(createUserDto.email))) {
      return this.userService.create(createUserDto);
    } else {
      return new BadRequestException('Email already has an account');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  remove(@Request() req) {
    return this.userService.remove(req.user.id);
  }
}
