import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  CreateProductDto,
  CreateProductSchema,
} from './dto/create-product.dto';
import { UpdateProductSchema } from './dto/update-product.dto';
import { CommonService } from '@app/common';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class CreateProductValidationPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: CreateProductDto) {
    const { error } = CreateProductSchema.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors,
      });
    }
    return value;
  }
}

@Injectable()
export class UpdateProductValidationPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: CreateProductDto) {
    const { error } = UpdateProductSchema.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors,
      });
    }
    return value;
  }
}

@Injectable()
export class ImageTransformPipe implements PipeTransform {
  async transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [
          {
            field: 'name',
            message: 'No file was uploaded',
          },
        ],
      });
    }
    if (file.size > Math.pow(10, 7)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        errors: [
          {
            field: 'name',
            message: 'Uploaded file is too large',
          },
        ],
      });
    }
    const originalName = path.parse(file.originalname).name;
    const filename = Date.now() + '-' + originalName + '.webp';

    await sharp(file.buffer)
      .webp({ quality: 20 })
      .toFile(path.join('uploads', filename));

    return filename;
  }
}
