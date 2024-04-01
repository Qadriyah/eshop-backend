import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { ADDRESS_TYPES } from '@app/common/constants';
import mongoosePaginate from '@app/common/mongoosePaginate';

export type AddressDocument = HydratedDocument<Address>;

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
export class Address {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  user: User;

  @Prop({ required: true })
  line1: string;

  @Prop()
  line2: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postal_code: string;

  @Prop({ required: true })
  country: string;

  @Prop({
    default: ADDRESS_TYPES.shipping,
  })
  type: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.plugin(mongoosePaginate);
