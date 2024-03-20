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
import {
  UpdateProductDto,
  UpdateProductSchema,
} from './dto/update-product.dto';
import { CommonService } from '@app/common';

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

  transform(value: UpdateProductDto) {
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
