import { AbstractRepository } from '@app/common';
import { Message, MessageDocument } from './entities/message.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

export class MessagesRepository extends AbstractRepository<MessageDocument> {
  constructor(
    @InjectModel(Message.name) messageModel: PaginateModel<MessageDocument>,
  ) {
    super(messageModel);
  }
}
