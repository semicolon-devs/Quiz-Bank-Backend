import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';
import { Role } from '../../enums/roles.enum';

export type OTPDocument = HydratedDocument<OTP>;

@Schema()
export class OTP {
  @Prop({ type: String, required: true, max: 8 })
  key: string;

  @Prop({ type: Date, required: true })
  expireAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
