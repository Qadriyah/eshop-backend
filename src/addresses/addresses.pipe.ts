import { CommonService } from '@app/common';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  CreateAddressDto,
  CreateAddressSchema,
} from './dto/create-address.dto';

@Injectable()
export class AddressesValidationPipe implements PipeTransform {
  constructor(private readonly commonService: CommonService) {}

  transform(value: CreateAddressDto) {
    const { error } = CreateAddressSchema.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}
