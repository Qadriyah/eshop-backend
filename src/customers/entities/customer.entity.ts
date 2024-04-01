import mongoosePaginate from '@app/common/mongoosePaginate';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
export class Customer {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  birthDate: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.plugin(mongoosePaginate);
