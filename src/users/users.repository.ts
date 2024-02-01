import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  create(user: CreateUserDto) {
    try {
      const newUser = new this.userModel(user);
      return newUser.save();
    } catch (err) {}
  }

  findOne(filterQuery: FilterQuery<User>) {
    try {
      return this.userModel.findOne(filterQuery);
    } catch (err) {}
  }

  find(filterQuery: FilterQuery<User>) {
    try {
      return this.userModel.find(filterQuery);
    } catch (err) {}
  }

  findOneAndUpdate(
    filterQuery: FilterQuery<User>,
    user: Partial<User>,
    options = {},
  ) {
    try {
      return this.userModel.findByIdAndUpdate(filterQuery, user, {
        new: true,
        ...options,
      });
    } catch (err) {}
  }
}
