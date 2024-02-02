import mongoose from 'mongoose';
import * as Joi from 'joi';
import { ProfileDocument } from '../entities/profile.entity';

export class CreateProfileDto {
  user: mongoose.Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
}

export const CreateProfileSchema = Joi.object({
  user: Joi.string().email(),
  firstName: Joi.string(),
  lastName: Joi.string(),
}).options({
  abortEarly: false,
});

export class UserResponse {
  statusCode: number;
  message?: string;
  profile?: ProfileDocument;
  profiles?: ProfileDocument[];
}
