import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SalesRepository } from './sales.repository';
import { SaleDocument } from './entities/sale.entity';
import { FilterQuery, PaginateResult } from 'mongoose';
import { PaginateOptions } from '@app/common';

@Injectable()
export class SalesService {
  private readonly logger = new Logger(SalesService.name);

  constructor(private readonly salesRepository: SalesRepository) {}

  async create(createSaleDto: CreateSaleDto): Promise<SaleDocument> {
    try {
      const order = this.salesRepository.create(
        createSaleDto as unknown as SaleDocument,
      );
      return order;
    } catch (err) {
      this.logger.error('sales.service.create', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'order',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findBySession(sessionId: string): Promise<SaleDocument> {
    try {
      const order = this.salesRepository.findOne({ session: sessionId });
      return order;
    } catch (err) {
      this.logger.error('sales.service.findBySession', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'order',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findAll(
    query: FilterQuery<SaleDocument>,
    options: PaginateOptions,
  ): Promise<PaginateResult<SaleDocument>> {
    try {
      const result = await this.salesRepository.paginate(query, {
        ...options,
        populate: [
          {
            path: 'user',
            select: 'email avator roles',
            populate: [{ path: 'profile' }],
          },
        ],
        sort: '-createdAt',
      });
      return result;
    } catch (err) {
      this.logger.error('sales.service.findAll', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'order',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findOne(id: string): Promise<SaleDocument> {
    try {
      const sale = await this.salesRepository.findOne({ _id: id }).populate([
        {
          path: 'user',
          select: 'email roles, avator',
          populate: [{ path: 'profile' }],
        },
      ]);
      return sale;
    } catch (err) {
      this.logger.error('sales.service.findOne', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'order',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async update(
    id: string,
    updateSaleDto: UpdateSaleDto,
  ): Promise<SaleDocument> {
    try {
      const order = await this.salesRepository.findOneAndUpdate(
        { _id: id },
        updateSaleDto,
      );
      return order;
    } catch (err) {
      this.logger.error('sales.service.update', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'order',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findCustomerSales(
    query: FilterQuery<SaleDocument>,
    options: PaginateOptions,
  ): Promise<PaginateResult<SaleDocument>> {
    try {
      const result = await this.salesRepository.paginate(query, {
        ...options,
        populate: [
          {
            path: 'user',
            select: 'email avator roles',
            populate: [{ path: 'profile' }],
          },
        ],
        sort: '-createdAt',
      });
      return result;
    } catch (err) {
      this.logger.error('sales.service.getCustomerSales', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'order',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  public async generateOrderNumber(): Promise<number> {
    try {
      const min = 1000;
      const max = 999999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
      const order = await this.salesRepository.findOne({
        orderNumber: randomNumber,
      });
      if (order) {
        return this.generateOrderNumber();
      }
      return randomNumber;
    } catch (err) {
      this.logger.error('sale.service.generateOrderNumber', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'payment',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
