import * as Joi from 'joi';

export class ResetPasswordDto {
  oldPassword: string;
  newPassword: string;
}

export const ResetPasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .regex(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/)
    .required()
    .label('password'),
  confirmPassword: Joi.any()
    .equal(Joi.ref('newPassword'))
    .required()
    .label('Confirm password')
    .options({ messages: { 'any.only': '{{#label}} does not match' } }),
}).options({
  abortEarly: false,
});
