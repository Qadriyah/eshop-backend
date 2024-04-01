import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { AbstractRepository } from '@app/common';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    userModel: PaginateModel<UserDocument>,
  ) {
    super(userModel);
  }
}
