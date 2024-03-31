import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User } from '../users/interfaces/user.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard as JwtAuthGuardQBank } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // need to authenticate with a jwt token for qbank moderator or Admin
  @UseGuards(JwtAuthGuardQBank)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post('register')
  async register(@Body() registerDto: CreateAuthDto): Promise<User> {
    return await this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: any): Promise<any> {
    return this.authService.login(request.user._doc);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Request() request: any): Promise<any> {
    return this.authService.refreshTokens(request.user);
  }

  @UseGuards(JwtAuthGuardQBank)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Get('users/all')
  async getAllUserDetails() {
    return this.authService.getAllUserDetails();
  }

  // need to authenticate with a jwt token for qbank moderator or Admin
  @UseGuards(JwtAuthGuardQBank)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(`:id`)
  async removeStudent(@Param('id') id: string) {
    return this.authService.removeUser(id);
  }
}
