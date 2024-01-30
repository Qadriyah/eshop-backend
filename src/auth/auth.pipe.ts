import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UtilityService } from '../utility/utility.service';
import { CreateAuthDto, CreateAuthSchema } from './dto/create-auth.dto';

@Injectable()
export class AuthPipe implements PipeTransform {
  constructor(private utilService: UtilityService) {}

  transform(value: CreateAuthDto) {
    const { error } = CreateAuthSchema.validate(value);
    if (error) {
      const errors = this.utilService.formatError(error);
      throw new BadRequestException(errors);
    }
    return value;
  }
}
