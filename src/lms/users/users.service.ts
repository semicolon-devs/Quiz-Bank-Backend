import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserSchema } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './interfaces/user.interface';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchema.name, 'lms')
    private readonly userModel: Model<User>,
  ) {}

  async register(registerDto: CreateAuthDto): Promise<User> {
    const hash = await bcrypt.hash(registerDto.password, saltOrRounds);

    const user: User = {
      name: registerDto.name,
      email: registerDto.email,
      password: hash,
    };
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  async updatePasssword(email: string, newPassword: string): Promise<User> {
    const hash = await bcrypt.hash(newPassword, saltOrRounds);

    return this.userModel
      .findOneAndUpdate({ email: email }, { password: hash })
      .exec();
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

  async deleteAll(): Promise<any> {
    const deletedUser = await this.userModel.deleteMany({}).exec();
    return deletedUser;
  }
}
