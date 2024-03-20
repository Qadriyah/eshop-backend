import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ReadStream, createReadStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ProductRepository } from '../product/product.repository';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async uploadProductImage(
    imageUrl: string,
    productId: string,
  ): Promise<string> {
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

  async uploadProductIcon(
    imageUrl: string,
    productId: string,
  ): Promise<string> {
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

  async uploadProfileImage(imageUrl: string, userId: string): Promise<string> {
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

  async deleteProductImage(
    productId: string,
    filePath: string,
  ): Promise<string> {
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
        { _id: product.id },
        { images: product.images.filter((image) => image !== filePath) },
      );
      await this.deleteFileFromServer(filePath);
      return filePath;
    } catch (err) {
      this.logger.error('files.service.deleteProductImage', err);
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

  async deleteFileFromServer(url: string): Promise<void> {
    try {
      const filename = url.substring(url.lastIndexOf('/') + 1);
      const filePath = path.resolve(process.cwd(), 'uploads', `${filename}`);
      await fs.unlink(filePath);
    } catch (err) {
      this.logger.error('files.service.deleteFileFromServer', err);
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

  async downloadImage(filename: string): Promise<ReadStream> {
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
