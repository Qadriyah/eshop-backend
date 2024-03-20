import * as Joi from 'joi';
import { PartialType } from '@nestjs/mapped-types';
import { DISCOUNT_TYPES, PRODUCT_STATUS } from '@app/common/constants';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export const UpdateProductSchema = Joi.object({
  sku: Joi.string().optional(),
  name: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(PRODUCT_STATUS))
    .optional(),
  icon: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  description: Joi.string().optional(),
  price: Joi.number().optional(),
  discountType: Joi.string()
    .valid(...Object.values(DISCOUNT_TYPES))
    .optional(),
  quantity: Joi.number().optional(),
  stock: Joi.number().optional(),
  allowBackorders: Joi.boolean().optional(),
  weight: Joi.number().optional(),
  length: Joi.number().optional(),
  width: Joi.number().optional(),
  height: Joi.number().optional(),
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
