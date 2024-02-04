import * as Joi from 'joi';

export class CreateAuthDto {
  email: string;
  password: string;
}
export class CreateVisitorAuthDto {
  email: string;
}

export const CreateAuthSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({
  abortEarly: false,
});

export const CreateVisitorAuthSchema = Joi.object({
  email: Joi.string().email().required(),
}).options({
  abortEarly: false,
});

export class AuthResponse {
  statusCode: number;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
}
