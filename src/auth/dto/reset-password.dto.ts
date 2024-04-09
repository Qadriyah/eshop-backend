import * as Joi from 'joi';

export class ResetPasswordRequestDto {
  email: string;
}

export class ResetPasswordByLinkDto {
  password: string;
}

export const ResetPasswordRequestSchema = Joi.object({
  email: Joi.string().email().required(),
}).options({
  abortEarly: false,
});

export const ResetPasswordByLinkSchema = Joi.object({
  password: Joi.string()
    .regex(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/)
    .required()
    .label('password'),
  confirmPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } }),
}).options({
  abortEarly: false,
});
