import { PartialType } from '@nestjs/mapped-types';

export class CreateCustomerDto {
  name: string;
  email: string;
  phone?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}

export class PaymentMethodType {
  id: string;
  brand: string;
  default: boolean;
  type: string;
  number: string;
  expiry: string;
}
