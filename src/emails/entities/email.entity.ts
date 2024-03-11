import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
export class Email {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  fromName: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  template: string;

  @Prop({ required: true })
  body: string;

  @Prop({ default: 0 })
  retries: number;
}

export type EmailDocument = HydratedDocument<Email>;
export const EmailSchema = SchemaFactory.createForClass(Email);
