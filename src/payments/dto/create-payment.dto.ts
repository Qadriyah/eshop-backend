import * as Joi from 'joi';

export type OrderItem = {
  product: string;
  quantity: number;
};

export type AddressType = {
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export class CreatePaymentDto {
  lineItems: OrderItem[];
  address: AddressType;
  salesTax?: number;
  name?: string;
  carrier?: string;
  phone?: string;
}

export const CreatePaymentValidation = Joi.object({
  lineItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
      }),
    )
    .required(),
  address: Joi.object({
    line1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postal_code: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  carrier: Joi.string(),
}).options({
  abortEarly: false,
});

export const CalculateSalesTaxValidation = Joi.object({
  lineItems: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
      }),
    )
    .required(),
  address: Joi.object({
    line1: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postal_code: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  carrier: Joi.string(),
}).options({
  abortEarly: false,
});

export class PaymentResponse {
  statusCode: number;
  clientSecret?: string;
  salesTax?: number;
}
