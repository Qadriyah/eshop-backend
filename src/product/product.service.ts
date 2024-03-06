import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PRODUCT_STATUS } from '@app/common/constants';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ProductDocument } from './entities/product.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly configService: ConfigService,
  ) {}

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

  async findAll() {
    try {
      const products = await this.productRepo.find({});
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

  async uploadImage(filename: string, productId: string) {
    try {
      const product = await this.productRepo.findOne({ _id: productId });
      if (!product) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          errors: [
            {
              field: 'name',
              message: 'Product not found',
            },
          ],
        });
      }
      const imageLocation = `${this.configService.get(
        'BASE_URL',
      )}/products/download/${filename}`;

      await this.productRepo.findOneAndUpdate(
        { _id: productId },
        { images: [...product.images, imageLocation] },
      );
      return filename;
    } catch (err) {
      this.logger.error('product.service.uploadImage', err);
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

  async downloadImage() {
    try {
      const options = {
        root: `${__dirname}/../uploads`,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'x-sent': true,
        },
      };
      return options;
    } catch (err) {
      this.logger.error('product.service.downloadImage', err);
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
