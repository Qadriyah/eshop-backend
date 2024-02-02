import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CommonService } from '@app/common';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform<CreateUserDto> {
  constructor(private commonService: CommonService) {}

  transform(value: CreateUserDto) {
    const { error } = CreateUserSchema.validate(value);
    if (error) {
      const errors = this.commonService.formatError(error);
      throw new BadRequestException(errors);
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
      throw new BadRequestException(errors);
    }
    return value;
  }
}
