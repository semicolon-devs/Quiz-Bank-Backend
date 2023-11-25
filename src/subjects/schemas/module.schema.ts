import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema()
export class Module {
  @Prop({ type: String, unique: true, required: true })
  name: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
