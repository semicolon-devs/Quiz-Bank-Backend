import {
  Controller,
  Request,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { Role } from 'src/enums/roles.enum';
import { Roles } from './decorator/roles.decorator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    await this.usersService.create(registerDto, [Role.USER]);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post('register-moderator')
  async moderatorRegister(@Body() registerDto: RegisterDto) {
    await this.usersService.create(registerDto, [Role.USER, Role.MODERATOR]);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post('register-admin')
  async adminRegister(@Body() registerDto: RegisterDto) {
    await this.usersService.create(registerDto, [
      Role.USER,
      Role.MODERATOR,
      Role.ADMIN,
    ]);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Request() request: any) {
    return this.authService.refreshTokens(request.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() request: any) {
    return this.authService.login(request.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('reset-password')
  @HttpCode(200)
  async passwordReset(@Request() req: any) {
    return this.authService.resetPassword(req.user, req.Body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-details')
  async getUserDetails(@Request() req: any) {
    return req.user;
  }
}
