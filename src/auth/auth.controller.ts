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
import { UserInterface } from 'src/users/interfaces/user.interface';
import { ForgetPasswordRequest } from 'src/auth/dto/forget-password.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { User } from 'src/users/schemas/user.schema';
import { ForgetPasswordReset } from './dto/forgetPasswordReset.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.usersService.create(registerDto, [Role.USER]);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post('register-moderator')
  async moderatorRegister(@Body() registerDto: RegisterDto) {
    return await this.usersService.create(registerDto, [
      Role.USER,
      Role.MODERATOR,
    ]);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Post('register-admin')
  async adminRegister(@Body() registerDto: RegisterDto): Promise<any> {
    return await this.usersService.create(registerDto, [
      Role.USER,
      Role.MODERATOR,
      Role.ADMIN,
    ]);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Request() request: any): Promise<any> {
    return this.authService.refreshTokens(request.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: any): Promise<any> {
    return this.authService.login(request.user._doc);
  }

  @UseGuards(LocalAuthGuard)
  @Post('reset-password')
  @HttpCode(200)
  async passwordReset(@Request() req: any): Promise<any> {
    return this.authService.resetPassword(req.user, req.Body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-details')
  async getUserDetails(@Request() req: any): Promise<any> {
    const { firstname, lastname, email, roles, _id } = req.user;
    return { firstname, lastname, email, roles, _id };
  }

  @Post('forget-password-request')
  async forgetPasswordRequest(@Body() payload: ForgetPasswordRequest) {
    return this.authService.forgetPasswordRequest(payload);
  }

  @Post('forget-password-reset')
  async forgetPasswordReset(@Body() payload: ForgetPasswordReset) {
    return this.authService.forgetPasswordReset(payload);
  }
}
