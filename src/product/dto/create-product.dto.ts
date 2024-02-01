import * as Joi from 'joi';
import { DISCOUNT_TYPES, PRODUCT_STATUS } from '../../config/constants';
import { ProductDocument } from '../entities/product.entity';

export class CreateProductDto {
  name: string;
  status?: string;
  icon?: string;
  images?: string[];
  description?: string;
  price: number;
  discountType?: string;
  percentDiscount?: number;
  fixedDiscount?: number;
}

export const CreateProductSchema = Joi.object({
  name: Joi.string().required(),
  status: Joi.string().valid(...Object.values(PRODUCT_STATUS)),
  icon: Joi.string().uri(),
  images: Joi.array().items(Joi.string().uri()),
  description: Joi.string(),
  price: Joi.number().required(),
  discountType: Joi.string().valid(...Object.values(DISCOUNT_TYPES)),
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

export const UpdateProductSchema = Joi.object({
  name: Joi.string(),
  status: Joi.string().valid(...Object.values(PRODUCT_STATUS)),
  icon: Joi.string(),
  images: Joi.array().items(Joi.string().uri()),
  description: Joi.string(),
  price: Joi.number(),
  discountType: Joi.string().valid(...Object.values(DISCOUNT_TYPES)),
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

export class ProductResponse {
  statusCode: number;
  message?: string;
  product?: ProductDocument;
  products?: ProductDocument[];
}
