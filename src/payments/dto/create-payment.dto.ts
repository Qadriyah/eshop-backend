import * as Joi from 'joi';
import Stripe from 'stripe';

export type OrderItem = {
  id: string;
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
  address?: AddressType;
  salesTax?: number;
  name?: string;
  carrier?: string;
  phone?: string;
  taxId?: string;
}

export class CheckoutSessionDto {
  email: string;
  shippingRate: string;
  lineItems: OrderItem[];
}

export const CheckoutSessionValidation = Joi.object({
  email: Joi.string().email().required(),
  shippingRate: Joi.string().required(),
  lineItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().required(),
      }),
    )
    .required(),
}).options({
  abortEarly: false,
});

export const CreatePaymentValidation = Joi.object({
  lineItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().required(),
      }),
    )
    .required(),
  taxId: Joi.string(),
}).options({
  abortEarly: false,
});

export const CalculateSalesTaxValidation = Joi.object({
  lineItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
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
}).options({
  abortEarly: false,
});

export class PaymentResponse {
  statusCode: number;
  clientSecret?: string;
  id?: string;
  salesTax?: number;
  payment?: Stripe.PaymentIntent;
  session?: Stripe.Checkout.Session;
  sessions?: Stripe.Response<Stripe.ApiList<Stripe.Checkout.Session>>;
  lineItems?: Stripe.Response<Stripe.ApiList<Stripe.LineItem>>;
}
