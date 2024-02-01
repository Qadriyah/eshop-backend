import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ProductDocument } from './entities/product.entity';
import { PRODUCT_STATUS } from '../config/constants';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(private readonly productRepo: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    try {
      const product = await this.productRepo.create(createProductDto);
      return product;
    } catch (err) {
      this.logger.error('product.service.create', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findAll() {
    try {
      const products = await this.productRepo.find({});
      return products;
    } catch (err) {
      this.logger.error('product.service.findAll', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findOne(productId: string) {
    try {
      const product = await this.productRepo.findOne({ _id: productId });
      return product;
    } catch (err) {
      this.logger.error('product.service.findOne', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async update(productId: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepo.findOneAndUpdate(
        { _id: productId },
        updateProductDto,
      );
      return product;
    } catch (err) {
      this.logger.error('product.service.update', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async remove(productId: string) {
    try {
      const product = await this.productRepo.findOneAndUpdate(
        { _id: productId },
        { status: PRODUCT_STATUS.inactive },
      );
      return product;
    } catch (err) {
      this.logger.error('product.service.remove', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
