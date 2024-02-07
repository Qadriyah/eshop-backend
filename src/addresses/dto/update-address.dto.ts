import { PickType } from '@nestjs/mapped-types';
import * as Joi from 'joi';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PickType(CreateAddressDto, [
  'address',
  'city',
  'state',
  'zipcode',
] as const) {
  type: string;
}

export const UpdateAddressSchema = Joi.object({
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  zipcode: Joi.string(),
  type: Joi.string(),
}).options({
  abortEarly: false,
});
