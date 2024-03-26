import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import * as moment from 'moment';
import { SalesRepository } from '../sales/sales.repository';
import { SaleDocument } from '../sales/entities/sale.entity';

type SaleReportItem = {
  key: string;
  date: string;
  orders: number;
  sold: number;
  tax: number;
  total: number;
};
type ReturnsReportItem = {
  key: string;
  date: string;
  returned: number;
  refunded: number;
  totalRefunded: number;
};
type CustomerReportItem = {
  key: string;
  email: string;
  fullName: string;
  status: string;
  createdAt: string;
  orders: number;
  products: number;
  total: number;
};
type ProductReportItem = {
  key: string;
  name: string;
  sold: number;
  total: number;
};

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly ordersRepository: SalesRepository) {}

  async getSalesReport(
    query: FilterQuery<SaleDocument>,
  ): Promise<SaleReportItem[]> {
    try {
      const orders = await this.ordersRepository.find(query);
      const map: Record<string, SaleReportItem> = {};
      orders.forEach((order: SaleDocument) => {
        const key = moment(order.createdAt).format('YYYY-MM-DD');
        const products = order.lineItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );
        if (map[key]) {
          map[key].orders = map[key].orders += 1;
          map[key].sold = map[key].sold + products;
          map[key].tax = map[key].tax + order.tax;
          map[key].total = map[key].total + order.totalAmount;
        } else {
          map[key] = {
            key,
            date: key,
            orders: 1,
            sold: products,
            tax: order.tax,
            total: order.totalAmount,
          };
        }
      });
      return Object.values(map);
    } catch (err) {
      this.logger.error('reports.service.getSalesReport', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'report',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async getReturnsReport(
    query: FilterQuery<SaleDocument>,
  ): Promise<ReturnsReportItem[]> {
    try {
      const orders = await this.ordersRepository.find(query);
      const map: Record<string, ReturnsReportItem> = {};
      orders.forEach((order: SaleDocument) => {
        const key = moment(order.createdAt).format('YYYY-MM-DD');
        if (map[key]) {
          map[key].returned = map[key].returned + 1;
          map[key].refunded = order.refunded
            ? map[key].refunded + 1
            : map[key].refunded + 0;
          map[key].totalRefunded = map[key].totalRefunded + order.totalAmount;
        } else {
          map[key] = {
            key,
            date: key,
            returned: 1,
            refunded: order.refunded ? 1 : 0,
            totalRefunded: order.totalAmount,
          };
        }
      });
      return Object.values(map);
    } catch (err) {
      this.logger.error('reports.service.getReturnsReport', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'report',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async getCustomerOrders(query: FilterQuery<SaleDocument>) {
    try {
      const orders = await this.ordersRepository.find(query).populate([
        {
          path: 'user',
          select: 'email roles deleted',
          populate: [{ path: 'profile' }],
        },
      ]);
      const map: Record<string, CustomerReportItem> = {};
      orders.forEach((order: SaleDocument) => {
        const key = String(order.user.id);
        const products = order.lineItems.reduce(
          (total, item) => total + item.quantity,
          0,
        );
        if (map[key]) {
          map[key].orders = map[key].orders + 1;
          map[key].products = map[key].products + products;
          map[key].total = map[key].total + order.totalAmount;
        } else {
          map[key] = {
            key,
            createdAt: order.createdAt,
            email: order.user.email,
            fullName: order.user.profile.fullName,
            orders: 1,
            products: products,
            status: order.user.deleted ? 'Banned' : 'Active',
            total: order.totalAmount,
          };
        }
      });
      return Object.values(map);
    } catch (err) {
      this.logger.error('reports.service.getCustomerOrders', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'report',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async getProductsRepoprt(query: FilterQuery<SaleDocument>) {
    try {
      const orders = await this.ordersRepository.find(query);
      const map: Record<string, ProductReportItem> = {};
      orders.forEach((order: SaleDocument) => {
        order.lineItems.forEach((item) => {
          const key = String(item.id);
          if (map[key]) {
            map[key].sold = map[key].sold + item.quantity;
            map[key].total = map[key].total + item.quantity * item.price;
          } else {
            map[key] = {
              key,
              name: item.name,
              sold: item.quantity,
              total: item.quantity * item.price,
            };
          }
        });
      });
      return Object.values(map);
    } catch (err) {
      this.logger.error('reports.service.getProductsRepoprt', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'report',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
