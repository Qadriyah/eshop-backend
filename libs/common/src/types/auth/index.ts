import { Schema } from 'mongoose';
import { SaleDocument } from 'src/sales/entities/sale.entity';

export type SearchQuery = {
  from?: string;
  to?: string;
};

export type PaginateOptions = {
  page?: number;
  limit?: number;
};
export interface GetGoogleAuth {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
  userId: Schema.Types.ObjectId;
  userInfo: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
  };
}

export interface CreateGuestAuth {
  accessToken: string;
  userId: Schema.Types.ObjectId;
}

export interface CreateNormalAuth {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
}

export interface PaginatedResponse {
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
  };
}

export interface SaleResponse {
  statusCode: number;
  message?: string;
  sale: SaleDocument;
}

export interface SalesResponse extends PaginatedResponse {
  statusCode: number;
  message?: string;
  sales: SaleDocument[];
}
