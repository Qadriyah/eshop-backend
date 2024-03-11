import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { EmailsRepository } from './emails.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from './entities/email.entity';
import { UserRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';
import { CommonService } from '@app/common';
import { BullModule } from '@nestjs/bull';
import { EmailsProcessor } from './emails.processor';
import { EmailsSendgrid } from './emails.sendgrid';

@Module({
  controllers: [EmailsController],
  providers: [
    EmailsService,
    CommonService,
    EmailsRepository,
    UserRepository,
    EmailsProcessor,
    EmailsSendgrid,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Email.name,
        schema: EmailSchema,
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
export class EmailsModule {}
