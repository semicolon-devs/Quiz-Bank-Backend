import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  register(payload: CreateAuthDto) {
    return this.usersService.register(payload);
  }

  async login(user: User) {
    return await this.getTokens(user.email);
  }

  async refreshTokens(user: User) {
    return await this.getTokens(user.email);
  }

  async removeUser(id: string): Promise<User> {
    return  this.usersService.delete(id);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async getTokens(email: string) {
    const accessToken = this.jwtService.sign(
      {
        email: email,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '30m',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        email: email,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '1d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
