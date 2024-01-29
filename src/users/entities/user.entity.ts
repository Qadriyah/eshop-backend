import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: {
    virtuals: true,
    transform: function (_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  avator: string;

  @Prop({ type: [String], required: true })
  roles: string[];

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ default: false })
  deleted: boolean;

  @Prop()
  suspended: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
