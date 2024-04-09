import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CommonService } from '@app/common';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import {
  ResetPasswordDto,
  ResetPasswordSchema,
} from './dto/reset-password.dto';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform<CreateUserDto> {
  constructor(private commonService: CommonService) {}

  transform(value: CreateUserDto) {
    const { error } = CreateUserSchema.validate(value);
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
export class UpdateUserValidationPipe implements PipeTransform<UpdateUserDto> {
  constructor(private commonService: CommonService) {}

  transform(value: UpdateUserDto) {
    const { error } = UpdateUserSchema.validate(value);
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
export class ResetPasswordValidationPipe
  implements PipeTransform<ResetPasswordDto>
{
  constructor(private commonService: CommonService) {}

  transform(value: ResetPasswordDto) {
    const { error } = ResetPasswordSchema.validate(value);
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
