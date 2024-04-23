import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PRODUCT_STATUS } from '@app/common/constants';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ProductDocument } from './entities/product.entity';
import { FilterQuery } from 'mongoose';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(private readonly productRepo: ProductRepository) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    try {
      const product = await this.productRepo.create({
        ...createProductDto,
      } as ProductDocument);

      return product as ProductDocument;
    } catch (err) {
      this.logger.error('product.service.create', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findAll(query: FilterQuery<ProductDocument>) {
    try {
      const products = await this.productRepo.find(query).sort('-createdAt');
      return products;
    } catch (err) {
      this.logger.error('product.service.findAll', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
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
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
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
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
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
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
