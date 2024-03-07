import {
  SaleDocument,
  SaleItemType,
  SaleStatusType,
} from '../entities/sale.entity';

export class CreateSaleDto {
  user: string;
  session: string;
  lineItems: SaleItemType[];
  status?: SaleStatusType;
}

export class SalesResponse {
  statusCode: number;
  message?: string;
  sale?: SaleDocument;
  sales?: SaleDocument[];
}
