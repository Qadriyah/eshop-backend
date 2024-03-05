import { DISCOUNT_TYPES, PRODUCT_STATUS } from '@app/common/constants';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

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
export class Product {
  @Prop()
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: PRODUCT_STATUS.active })
  status: string;

  @Prop()
  icon: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: DISCOUNT_TYPES.none })
  discountType: string;

  @Prop()
  percentDiscount: number;

  @Prop()
  fixedDiscount: number;

  @Prop()
  stock: number;

  @Prop({ default: true })
  allowBackorders: boolean;

  @Prop()
  weight: number;

  @Prop()
  length: number;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function () {
  this.slug = slugify(this.name);
});

const slugify = (title: string) => {
  return title.toLowerCase().split(' ').join('-');
};
