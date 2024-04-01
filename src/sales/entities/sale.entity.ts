import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserDocument } from '../../users/entities/user.entity';
import { SALE_STATUS } from '@app/common/constants';
import mongoosePaginate from '@app/common/mongoosePaginate';

export type SaleDocument = HydratedDocument<Sale> & {
  createdAt: string;
  updatedAt: string;
};

export type SaleStatusType =
  | 'Pending'
  | 'Processing'
  | 'Completed'
  | 'Delivering'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type SaleItemType = {
  id: string;
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
  line1: string;

  @Prop()
  line2: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  postal_code: string;

  @Prop()
  country: string;
}

export class CustomerType {
  name: string;
  email: string;
  phone: string;
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

  @Prop()
  orderNumber: number;

  @Prop()
  shippingAddress: AddressType;

  @Prop()
  billingAddress: AddressType;

  @Prop()
  customer: CustomerType;

  @Prop()
  totalAmount: number;

  @Prop({ default: 0 })
  shipping: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: false })
  refunded: boolean;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

SaleSchema.plugin(mongoosePaginate);
