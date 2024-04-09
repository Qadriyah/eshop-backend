import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesRepository } from './messages.repository';
import { MessageDocument } from './entities/message.entity';
import { MSG_STATUS } from '@app/common/constants';
import { EmailsService } from '../emails/emails.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);
  constructor(
    private readonly messageRepository: MessagesRepository,
    private readonly emailService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    try {
      const message = await this.messageRepository.create(
        createMessageDto as MessageDocument,
      );
      await this.emailService.create({
        from: this.configService.get('EMAIL_SENDER'),
        to: createMessageDto.email,
        fromName: 'Notifications',
        subject: 'Contact Form',
        template: 'contact_us',
        body: {},
      });
      return message;
    } catch (err) {
      this.logger.error('messages.service.create', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findAll(): Promise<MessageDocument[]> {
    try {
      const messages = await this.messageRepository.find({
        status: MSG_STATUS.unread,
      });
      return messages;
    } catch (err) {
      this.logger.error('messages.service.findAll', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findOne(id: string): Promise<MessageDocument> {
    try {
      const message = await this.messageRepository.findOne({
        _id: id,
        status: MSG_STATUS.unread,
      });
      return message;
    } catch (err) {
      this.logger.error('messages.service.findOne', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<MessageDocument> {
    try {
      const message = await this.messageRepository.findOneAndUpdate(
        {
          _id: id,
        },
        { ...updateMessageDto },
      );
      return message;
    } catch (err) {
      this.logger.error('messages.service.update', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'name',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
