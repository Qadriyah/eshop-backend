import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  CreateAuthDto,
  CreateAuthSchema,
  CreateVisitorAuthDto,
  CreateVisitorAuthSchema,
} from './dto/create-auth.dto';
import { CommonService } from '@app/common';

@Injectable()
export class AuthPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: CreateAuthDto) {
    const { error } = CreateAuthSchema.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}

@Injectable()
export class VisitorAuthPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: CreateVisitorAuthDto) {
    const { error } = CreateVisitorAuthSchema.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}
