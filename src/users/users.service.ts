import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/roles.enum';
import { UserInterface } from './interfaces/user.interface';
import { ForgetPasswordRequest } from './interfaces/forget_password_request.interface';
import { ForgetPasswordReset } from './interfaces/ForgetPasswordReset.interface';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, 'quizbank') private readonly userModel: Model<User>,
  ) {}

  async create(registerDto: RegisterDto, roles: Role[]): Promise<User> {
    const hash = await bcrypt.hash(registerDto.password, saltOrRounds);

    const user: UserInterface = {
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      email: registerDto.email,
      roles: roles,
      password: hash,
    };
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  async createLMSUser(registerDto: RegisterDto, roles: Role[]): Promise<User> {
    const hash = await bcrypt.hash(registerDto.password, saltOrRounds);

    const user: UserInterface = {
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      email: registerDto.email,
      roles: roles,
      password: hash,
      key: registerDto.password,
    };
    const createdUser = await this.userModel.create(user);

    delete createdUser.password;
    delete createdUser.key;

    return createdUser;
  }

  async updatePasssword(email: string, newPassword: string): Promise<User> {
    const hash = await bcrypt.hash(newPassword, saltOrRounds);

    return this.userModel
      .findOneAndUpdate({ email: email }, { password: hash })
      .exec();
  }

  async resetPasssword(payload: ForgetPasswordReset): Promise<User> {
    return this.findOne(payload.email)
      .then(async (user: User) => {
        if (user.otp && user.otp.key == payload.otp) {
          const hash = await bcrypt.hash(payload.newPassword, saltOrRounds);

          const updatedUser = await this.userModel
            .findOneAndUpdate(
              { email: payload.email },
              { password: hash, $unset: { otp: '' } },
            )
            .exec();

          console.log(updatedUser);

          return updatedUser;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  async addOTP(payload: ForgetPasswordRequest): Promise<string> {
    const otp: string = this.generateOTP();
    const expireTime = new Date().setMinutes(+15);

    console.log(payload);

    const result = await this.userModel.findOneAndUpdate(
      {
        email: payload.email,
      },
      {
        otp: {
          key: otp,
          expireAt: expireTime,
        },
      },
    );

    if (!result) {
      throw new NotFoundException('Email not found');
    }

    return otp;
  }

  async findAllLMSUsers(): Promise<User[]> {
    return this.userModel.find({ roles: Role.LMS_USER });
  }

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedUser;
  }

  async deleteAllLMSUsers(): Promise<any> {
    const deletedUser = await this.userModel
      .deleteMany({ roles: Role.LMS_USER })
      .exec();
    return deletedUser;
  }

  generateOTP(): string {
    var chars = '0123456789';
    var passwordLength = 8;
    var password = '';

    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password;
  }
}
