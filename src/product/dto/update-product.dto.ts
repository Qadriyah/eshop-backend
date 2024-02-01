import * as Joi from 'joi';
import { PickType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { DISCOUNT_TYPES, PRODUCT_STATUS } from '../../config/constants';

export class UpdateProductDto extends PickType(CreateProductDto, [
  'sku',
  'name',
  'status',
  'icon',
  'images',
  'description',
  'price',
  'discountType',
  'percentDiscount',
  'fixedDiscount',
  'quantity',
  'stock',
  'allowBackorders',
  'weight',
  'length',
  'width',
  'height',
] as const) {}

export const UpdateProductSchema = Joi.object({
  sku: Joi.string(),
  name: Joi.string(),
  status: Joi.string().valid(...Object.values(PRODUCT_STATUS)),
  icon: Joi.string(),
  images: Joi.array().items(Joi.string().uri()),
  description: Joi.string(),
  price: Joi.number(),
  discountType: Joi.string().valid(...Object.values(DISCOUNT_TYPES)),
  quantity: Joi.number(),
  stock: Joi.number(),
  allowBackorders: Joi.boolean(),
  weight: Joi.number(),
  length: Joi.number(),
  width: Joi.number(),
  height: Joi.number(),
  percentDiscount: Joi.alternatives().conditional('discountType', {
    is: DISCOUNT_TYPES.percentage,
    then: Joi.number().required(),
    otherwise: Joi.number(),
  }),
  fixedDiscount: Joi.alternatives().conditional('discountType', {
    is: DISCOUNT_TYPES.fixed,
    then: Joi.number().required(),
    otherwise: Joi.number(),
  }),
}).options({
  abortEarly: false,
});
