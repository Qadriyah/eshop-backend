import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  CreateProductDto,
  CreateProductSchema,
} from './dto/create-product.dto';
import { UtilityService } from '../utility/utility.service';
import { UpdateProductSchema } from './dto/update-product.dto';

@Injectable()
export class CreateProductValidationPipe implements PipeTransform {
  constructor(private utilService: UtilityService) {}

  transform(value: CreateProductDto) {
    const { error } = CreateProductSchema.validate(value);
    if (error) {
      const errors = this.utilService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}

@Injectable()
export class UpdateProductValidationPipe implements PipeTransform {
  constructor(private utilService: UtilityService) {}

  transform(value: CreateProductDto) {
    const { error } = UpdateProductSchema.validate(value);
    if (error) {
      const errors = this.utilService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}
