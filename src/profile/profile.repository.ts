import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Profile, ProfileDocument } from './entities/profile.entity';
import { AbstractRepository } from '@app/common';

@Injectable()
export class ProfileRepository extends AbstractRepository<ProfileDocument> {
  constructor(
    @InjectModel(Profile.name) profileModel: PaginateModel<ProfileDocument>,
  ) {
    super(profileModel);
  }
}
