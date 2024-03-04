import { CommonService } from '@app/common';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  CalculateSalesTaxValidation,
  CheckoutSessionDto,
  CheckoutSessionValidation,
  CreatePaymentDto,
  CreatePaymentValidation,
} from './dto/create-payment.dto';

@Injectable()
export class CreatePaymentsPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: CreatePaymentDto) {
    const { error } = CreatePaymentValidation.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}

@Injectable()
export class CalculateTaxPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: CreatePaymentDto) {
    const { error } = CalculateSalesTaxValidation.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}

@Injectable()
export class CheckoutSessionPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: CheckoutSessionDto) {
    const { error } = CheckoutSessionValidation.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}
