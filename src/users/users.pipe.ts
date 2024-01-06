import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UtilityService } from '../utility/utility.service';

@Injectable()
export class CreateUserValidationPipe implements PipeTransform<CreateUserDto> {
  constructor(private utilService: UtilityService) {}

  transform(value: CreateUserDto) {
    const { error } = CreateUserSchema.validate(value);
    if (error) {
      const errors = this.utilService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}
