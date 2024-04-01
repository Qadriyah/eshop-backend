import { AbstractRepository } from '@app/common';
import { Email, EmailDocument } from './entities/email.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

export class EmailsRepository extends AbstractRepository<EmailDocument> {
  constructor(
    @InjectModel(Email.name) emailModel: PaginateModel<EmailDocument>,
  ) {
    super(emailModel);
  }
}
