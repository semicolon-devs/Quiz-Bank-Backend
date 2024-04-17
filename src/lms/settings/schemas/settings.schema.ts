import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema()
export class Settings {
  @Prop({ type: String, unique: true, required: true })
  driveLink: string;

  @Prop({ type: String, unique: true, required: true })
  batch: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
