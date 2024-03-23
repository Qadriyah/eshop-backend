import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { AddressType, CustomerType } from '../entities/sale.entity';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  orderNumber?: number;
  shippingAddress?: AddressType;
  billingAddress?: AddressType;
  customer?: CustomerType;
  totalAmount?: number;
  shipping?: number;
  tax?: number;
}
