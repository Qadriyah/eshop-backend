import { SaleItemType, SaleStatusType } from '../entities/sale.entity';

export class CreateSaleDto {
  user: string;
  session: string;
  lineItems: SaleItemType[];
  status?: SaleStatusType;
}
