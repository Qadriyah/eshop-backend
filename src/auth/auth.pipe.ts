import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  CreateAuthDto,
  CreateAuthSchema,
  CreateVisitorAuthDto,
  CreateVisitorAuthSchema,
} from './dto/create-auth.dto';
import { CommonService } from '@app/common';
import {
  ResetPasswordByLinkDto,
  ResetPasswordByLinkSchema,
  ResetPasswordRequestDto,
  ResetPasswordRequestSchema,
} from './dto/reset-password.dto';

@Injectable()
export class AuthPipe implements PipeTransform<CreateAuthDto> {
  constructor(private commonService: CommonService) {}

  transform(value: CreateAuthDto) {
    const { error } = CreateAuthSchema.validate(value);
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
export class VisitorAuthPipe implements PipeTransform<CreateVisitorAuthDto> {
  constructor(private commonService: CommonService) {}

  transform(value: CreateVisitorAuthDto) {
    const { error } = CreateVisitorAuthSchema.validate(value);
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
export class ResetPasswordRequestPipe
  implements PipeTransform<ResetPasswordRequestDto>
{
  constructor(private commonService: CommonService) {}

  transform(value: ResetPasswordRequestDto) {
    const { error } = ResetPasswordRequestSchema.validate(value);
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
export class ResetPasswordByLinkPipe
  implements PipeTransform<ResetPasswordByLinkDto>
{
  constructor(private commonService: CommonService) {}

  transform(value: ResetPasswordByLinkDto) {
    const { error } = ResetPasswordByLinkSchema.validate(value);
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
