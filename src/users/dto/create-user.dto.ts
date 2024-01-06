import * as Joi from 'joi';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  email: string;
  password: string;
  roles: string[];
  refreshToken: string;
  avator?: string;
}

export const CreateUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  roles: Joi.array().items(Joi.string().required()).required(),
  avator: Joi.string(),
}).options({
  abortEarly: false,
});

export class UserResponse {
  statusCode: number;
  user?: User;
  users?: User[];
  accessToken?: string;
  refreshToken?: string;
}
