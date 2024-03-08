import { AbstractRepository } from '@app/common';
import { Message, MessageDocument } from './entities/message.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class MessagesRepository extends AbstractRepository<MessageDocument> {
  constructor(@InjectModel(Message.name) messageModel: Model<MessageDocument>) {
    super(messageModel);
  }
}
