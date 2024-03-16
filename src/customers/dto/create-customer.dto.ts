import Stripe from 'stripe';
import * as Joi from 'joi';

export class CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
}

export class UpdateCardDto {
  account_holder_name?: string;
  account_holder_type?: string;
  address_city?: string;
  address_country?: string;
  address_line1?: string;
  address_line2?: string;
  address_state?: string;
  address_zip?: string;
  name?: string;
}

export type PaymentMethodType = {
  id: string;
  primary: boolean;
  expiry: string;
  billing_address: {
    address: {
      city: string;
      country: string;
      line1: string;
      line2?: string;
      postal_code: string;
      state: string;
    };
    email?: string;
    name: string;
    phone?: string;
  };
} & Stripe.PaymentMethod.Card;

export const CreateCustomerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
}).options({
  abortEarly: false,
});

export const UpdateCustomerSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(),
}).options({
  abortEarly: false,
});

export const UpdateCardSchema = Joi.object({
  account_holder_name: Joi.string().optional(),
  account_holder_type: Joi.string().optional(),
  address_city: Joi.string().optional(),
  address_country: Joi.string().optional(),
  address_line1: Joi.string().optional(),
  address_line2: Joi.string().optional(),
  address_state: Joi.string().optional(),
  address_zip: Joi.string().optional(),
  name: Joi.string().optional(),
}).options({
  abortEarly: false,
});
