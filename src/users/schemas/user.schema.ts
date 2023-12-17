import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from '../../enums/roles.enum';
import { OTP } from './otp.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({type:OTP, required:false})
  otp : OTP;

  @Prop([{ type: String, enum: Role }])
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
