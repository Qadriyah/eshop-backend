import { Injectable } from '@nestjs/common';
import { ValidationError } from 'joi';
import { Types } from 'mongoose';
import { UserDocument } from '../users/entities/user.entity';

type FieldError = {
  field: string;
  message: string;
};

type Payload = {
  id: Types.ObjectId;
  roles: string[];
};

@Injectable()
export class UtilityService {
  formatError(error: ValidationError): FieldError[] {
    return error.details.map((err) => {
      let message = err.message.replace(/"/g, '');
      if (err.type === 'string.pattern.base') {
        message = `${err.context?.label} should be a valid ObjectId`;
      }
      const fieldError: FieldError = {
        field: err.context?.key ?? '',
        message,
      };
      return fieldError;
    });
  }

  getTokenPayload(user: UserDocument): Payload {
    return {
      id: user.id,
      roles: user.roles,
    };
  }
}
