import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  CreateCustomerDto,
  CreateCustomerSchema,
  UpdateCardDto,
  UpdateCardSchema,
  UpdateCustomerSchema,
} from './dto/create-customer.dto';
import { CommonService } from '@app/common';

@Injectable()
export class CreateCustomerPipe implements PipeTransform {
  constructor(private readonly commonService: CommonService) {}

  transform(value: CreateCustomerDto) {
    const { error } = CreateCustomerSchema.validate(value);
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
export class UpdateCustomerPipe implements PipeTransform {
  constructor(private readonly commonService: CommonService) {}

  transform(value: CreateCustomerDto) {
    const { error } = UpdateCustomerSchema.validate(value);
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
export class UpdateCardPipe implements PipeTransform {
  constructor(private readonly commonService: CommonService) {}

  transform(value: UpdateCardDto) {
    const { error } = UpdateCardSchema.validate(value);
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
