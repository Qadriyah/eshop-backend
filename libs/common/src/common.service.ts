import { Injectable } from '@nestjs/common';
import { ValidationError } from 'joi';
import { Types } from 'mongoose';

type FieldError = {
  field: string;
  message: string;
};

type Payload = {
  id: Types.ObjectId;
  email: string;
  roles: string[];
};

type VisitorPayload = {
  email: string;
  roles: string[];
};

@Injectable()
export class CommonService {
  formatError(error: ValidationError): FieldError[] {
    return error.details.map((err) => {
      let message = err.message.replace(/"/g, '');
      if (err.type === 'string.pattern.base') {
        const { key } = err.context;
        if (err.context?.label === 'password') {
          message = `${key} should be at least 8 characters long and should contain a digit, uppercase and lowercase letters`;
        } else {
          message = `${err.context?.label} should be a valid ObjectId`;
        }
      }
      const fieldError: FieldError = {
        field: err.context?.key ?? '',
        message,
      };
      return fieldError;
    });
  }

  getTokenPayload(user: Payload): Payload {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
  }

  getVisitorTokenPayload(email: string): VisitorPayload {
    return {
      email,
      roles: ['Visitor'],
    };
  }

  slugify(title: string): string {
    return title.toLowerCase().split(' ').join('-');
  }

  getShippingRate(method: string) {
    const rates = {
      flatRate: 27.6,
    };
    return rates[method];
  }
}
