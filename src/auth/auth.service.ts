import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (user && (await bcrypt.compare(pass, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      try {
        const createdUser = await this.userService.create({
          ...createUserDto,
          password: hashedPassword,
        });
        return createdUser;
      } catch (error) {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async login(credential: User) {
    try {
      const user: User = await this.validateUser(
        credential.email,
        credential.password,
      );
      if (user != null) {
        Logger.log(user);
        const payload = {
          email: user.email,
          id: user.id,
        };
        Logger.log(payload);
        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        return new UnauthorizedException();
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
