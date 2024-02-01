import * as Joi from 'joi';
import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PickType(CreateUserDto, [
  'avator',
  'roles',
] as const) {
  deleted: boolean;
  suspended: boolean;
}

export const UpdateUserSchema = Joi.object({
  roles: Joi.array().items(Joi.string()),
  avator: Joi.string(),
  deleted: Joi.boolean(),
  suspended: Joi.boolean(),
}).options({
  abortEarly: false,
});
