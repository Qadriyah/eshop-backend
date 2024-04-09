import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as randtoken from 'rand-token';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { UserDocument } from './entities/user.entity';
import { ProfileRepository } from '../profile/profile.repository';
import { ProfileDocument } from '../profile/entities/profile.entity';
import { PaginateOptions } from '@app/common';
import { FilterQuery, PaginateResult } from 'mongoose';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findOne({
        email: createUserDto.email,
        deleted: false,
      });

      if (user) {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          errors: [
            {
              field: 'email',
              message: 'Email is already taken',
            },
          ],
        });
      }

      const newUser = await this.userRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
        refreshToken: randtoken.uid(256),
      } as UserDocument);

      await this.profileRepository.create({
        user: newUser._id,
      } as unknown as ProfileDocument);

      return newUser as UserDocument;
    } catch (err) {
      this.logger.error('user.service.create', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findAll(
    query: FilterQuery<UserDocument>,
    options: PaginateOptions,
  ): Promise<PaginateResult<UserDocument>> {
    try {
      const result = await this.userRepository.paginate(query, {
        ...options,
        populate: [
          {
            path: 'profile',
          },
        ],
        sort: '-createdAt',
        lean: false,
      });
      return result;
    } catch (err) {
      this.logger.error('user.service.findAll', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      const user = await this.userRepository
        .findOne({ _id: id })
        .populate([{ path: 'profile' }]);
      return user;
    } catch (err) {
      this.logger.error('user.service.findOne', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findOneAndUpdate(
        { _id: id },
        updateUserDto,
      );
      return user;
    } catch (err) {
      this.logger.error('user.service.update', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async remove(id: string): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findOneAndUpdate(
        { _id: id },
        { deleted: true },
      );
      return user;
    } catch (err) {
      this.logger.error('user.service.remove', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    try {
      let user = await this.userRepository
        .findOne({
          _id: userId,
          deleted: false,
          suspended: false,
        })
        ?.select('email password roles');

      if (!user) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          errors: [
            {
              field: 'email',
              message: 'User was not found',
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(
        resetPasswordDto.oldPassword,
        String(user.password),
      );

      if (!isMatch) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          errors: [
            {
              field: 'oldPassword',
              message: 'Old password does not match',
            },
          ],
        });
      }

      user = await this.userRepository.findOneAndUpdate({ _id: userId }, {
        password: await bcrypt.hash(resetPasswordDto.newPassword, 10),
        refreshToken: randtoken.uid(256),
      } as UserDocument);

      return user;
    } catch (err) {
      this.logger.error('user.service.resetPassword', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
