import * as Joi from 'joi';
import { AddressDocument } from '../entities/address.entity';

export class CreateAddressDto {
  address: string;
  city: string;
  state: string;
  zipcode: string;
  user?: string;
  type?: string;
}

export const CreateAddressSchema = Joi.object({
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipcode: Joi.string().required(),
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
