import { CommonService } from '@app/common';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import {
  CreateMessageDto,
  createMessageSchema,
} from './dto/create-message.dto';

@Injectable()
export class MessagesPipe implements PipeTransform {
  constructor(private commonService: CommonService) {}

  transform(value: CreateMessageDto) {
    const { error } = createMessageSchema.validate(value);
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
