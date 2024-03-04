import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../users/entities/user.entity';
import { SALE_STATUS } from '@app/common/constants';

export type SaleDocument = HydratedDocument<Sale>;

export type SaleStatusType =
  | 'Pending'
  | 'Processing'
  | 'Completed'
  | 'Delivering'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type SaleItemType = {
  name: string;
  price: number;
  quantity: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  icon: string;
};

export class AddressType {
  @Prop()
  addressLine1: string;

  @Prop()
  addressLine2: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipcode: string;

  @Prop()
  country: string;

  @Prop()
  name: string;
}

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
export class Sale {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({ required: true })
  session: string;

  @Prop({ required: true })
  lineItems: SaleItemType[];

  @Prop({ default: SALE_STATUS.pending })
  status: SaleStatusType;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

SaleSchema.virtual('totalAmount').get(function () {
  const totalAmount = this.lineItems?.reduce(
    (total, item) => (total += item.quantity * item.price),
    0,
  );
  return totalAmount;
});
