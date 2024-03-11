import { AbstractRepository } from '@app/common';
import { Email, EmailDocument } from './entities/email.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class EmailsRepository extends AbstractRepository<EmailDocument> {
  constructor(@InjectModel(Email.name) emailModel: Model<EmailDocument>) {
    super(emailModel);
  }
}
