import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../enums/roles.enum';

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

  @Prop([{ type: String, enum: Role }])
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
