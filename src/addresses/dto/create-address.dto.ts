import * as Joi from 'joi';
import { AddressDocument } from '../entities/address.entity';

export class CreateAddressDto {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  user?: string;
  type?: string;
}

export const CreateAddressSchema = Joi.object({
  line1: Joi.string().required(),
  line2: Joi.string(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postal_code: Joi.string().required(),
  type: Joi.string(),
}).options({
  abortEarly: false,
});

export class AddressResponse {
  statusCode: number;
  message?: string;
  address?: AddressDocument;
  addresses?: AddressDocument[];
}
