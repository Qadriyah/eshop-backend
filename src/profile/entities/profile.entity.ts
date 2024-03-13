import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type ProfileDocument = HydratedDocument<Profile>;

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
export class Profile {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  customer: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
