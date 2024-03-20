import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ProductRepository } from '../product/product.repository';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async uploadProductImage(imageUrl: string, productId: string) {
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

      await this.productRepo.findOneAndUpdate(
        { _id: productId },
        { images: [...product.images, imageUrl] },
      );
      return imageUrl;
    } catch (err) {
      this.logger.error('files.service.uploadProductImage', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'image',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async uploadProductIcon(imageUrl: string, productId: string) {
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

      await this.productRepo.findOneAndUpdate(
        { _id: productId },
        { icon: imageUrl },
      );
      return imageUrl;
    } catch (err) {
      this.logger.error('files.service.uploadProductIcon', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'image',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async uploadProfileImage(imageUrl: string, userId: string) {
    try {
      const user = await this.userRepository.findOne({ _id: userId });
      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          errors: [
            {
              field: 'image',
              message: 'User not found',
            },
          ],
        });
      }

      await this.userRepository.findOneAndUpdate(
        { _id: userId },
        { avator: imageUrl },
      );
      return imageUrl;
    } catch (err) {
      this.logger.error('files.service.uploadProfileImage', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'image',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async downloadImage(filename: string): Promise<any> {
    try {
      const file = createReadStream(join(process.cwd(), 'uploads', filename));
      return file;
    } catch (err) {
      this.logger.error('files.service.downloadImage', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'image',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
