import Stripe from 'stripe';
import * as Joi from 'joi';

export class CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
}

export type PaymentMethodType = {
  id: string;
  primary: boolean;
  expiry: string;
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
