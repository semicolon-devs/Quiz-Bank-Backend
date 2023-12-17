import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { User } from 'src/users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { ForgetPasswordRequest } from 'src/auth/dto/forget-password.dto';
import { sendEmail } from 'src/common/services/email.service';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { ForgetPasswordReset } from './dto/forgetPasswordReset.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserInterface) {   
    return await this.getTokens(user.email, user.firstname);
  }

  async refreshTokens(user: any) {
    return await this.getTokens(user.email, user.firstname);
  }

  async resetPassword(user: UserInterface, requestDto: UpdatePasswordDto) {
    this.usersService.updatePasssword(user.email, requestDto.newPassword);
    return this.login(user);
  }

  async forgetPasswordRequest(payload: ForgetPasswordRequest) {
    this.usersService.addOTP(payload)
    .then((otp) => {     
      sendEmail(otp, payload.email);
    })
    .catch((err) => {
      throw err;
    })

  }

  async forgetPasswordReset(payload: ForgetPasswordReset) {
    this.usersService.resetPasssword(payload);
  }

  async getTokens(email: string, firstname: string) {   
    const accessToken = this.jwtService.sign(
      {
        email: email,
        username: firstname,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '30m',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        email: email,
        username: firstname,
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
