import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ 
  timestamps: true,
  collection: 'users'
})
export class UserSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);
