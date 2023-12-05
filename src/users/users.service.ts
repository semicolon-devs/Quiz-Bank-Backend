import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/enums/roles.enum';
import { UserInterface } from './interfaces/user.interface';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(
    registerDto: RegisterDto,
    roles: Role[],
  ): Promise<UserInterface> {
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

  async updatePasssword(
    email: any,
    newPassword: string,
  ): Promise<UserInterface> {
    const hash = await bcrypt.hash(newPassword, saltOrRounds);

    return this.userModel
      .findOneAndUpdate({ email: email }, { password: hash })
      .exec();
  }

  async findOne(email: string): Promise<UserInterface> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async delete(id: string): Promise<UserInterface> {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedUser;
  }
}
