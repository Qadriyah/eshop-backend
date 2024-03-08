import * as Joi from 'joi';
import { MessageDocument } from '../entities/message.entity';

export class CreateMessageDto {
  name: string;
  email: string;
  phone: string;
  comment: string;
}

export const createMessageSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  comment: Joi.string().required(),
});

export class MessageResponse {
  statusCode: number;
  message?: string;
  messageObj?: MessageDocument;
  messages?: MessageDocument[];
}
