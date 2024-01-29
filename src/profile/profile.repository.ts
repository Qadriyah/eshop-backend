import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile, ProfileDocument } from './entities/profile.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  create(user: CreateProfileDto) {
    try {
      const profile = new this.profileModel(user);
      return profile.save();
    } catch (err) {}
  }

  findOne(filterQuery: FilterQuery<Profile>) {
    try {
      return this.profileModel.findOne(filterQuery);
    } catch (err) {}
  }

  find(filterQuery: FilterQuery<Profile>) {
    try {
      return this.profileModel.find(filterQuery);
    } catch (err) {}
  }

  findOneAndUpdate(
    filterQuery: FilterQuery<Profile>,
    user: Partial<Profile>,
    options = {},
  ) {
    try {
      return this.profileModel.findByIdAndUpdate(filterQuery, user, {
        new: true,
        ...options,
      });
    } catch (err) {}
  }
}