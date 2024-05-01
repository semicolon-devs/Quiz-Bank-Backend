import {
  Controller,
  Request,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Role } from 'src/enums/roles.enum';
import { Roles } from './decorator/roles.decorator';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { ForgetPasswordRequest } from 'src/auth/dto/forget-password.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { User } from 'src/users/schemas/user.schema';
import { ForgetPasswordReset } from './dto/forgetPasswordReset.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UpdateUserDetailsDto } from './dto/updateUserDetails.dto';

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

  @Post('register-lms-user')
  async registerLMSUser(@Body() registerDto: RegisterDto): Promise<User> {
    return await this.usersService.createLMSUser(registerDto, [Role.LMS_USER]);
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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Post('reset-password')
  async passwordReset(
    @Request() req: any,
    @Body() payload: UpdatePasswordDto,
  ): Promise<any> {
    return await this.authService.resetPassword(req.user, payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-details')
  async getUserDetails(@Request() req: any): Promise<any> {
    const { firstname, lastname, email, roles, _id } = req.user;
    return { firstname, lastname, email, roles, _id };
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @Get('all-lms-users')
  async getAllLMSUsers(): Promise<any> {
    return this.usersService.findAllLMSUsers();
  }

  @Post('forget-password-request')
  async forgetPasswordRequest(@Body() payload: ForgetPasswordRequest) {
    return this.authService.forgetPasswordRequest(payload);
  }

  @Post('forget-password-reset')
  async forgetPasswordReset(@Body() payload: ForgetPasswordReset) {
    return this.authService.forgetPasswordReset(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Delete(`:id`)
  async removeStudent(@Param('id') id: string) {
    return this.authService.removeUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
  @Patch()
  async updateUserDetails(
    @Request() req: any,
    @Body() payload: UpdateUserDetailsDto,
  ) {
    return this.usersService.updateUserDetails(req.user.email, payload);
  }
}
