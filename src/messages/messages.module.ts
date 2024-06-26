import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessagesRepository } from './messages.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/message.entity';
import { UserRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';
import { CommonService } from '@app/common';
import { EmailsService } from '../emails/emails.service';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    CommonService,
    EmailsService,
    MessagesRepository,
    UserRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
})
export class MessagesModule {}
