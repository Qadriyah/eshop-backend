import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as randtoken from 'rand-token';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { UserDocument } from './entities/user.entity';
import { ProfileRepository } from '../profile/profile.repository';
import { ProfileDocument } from '../profile/entities/profile.entity';

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
          message: [
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
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userRepository.find({ deleted: false });
    } catch (err) {
      this.logger.error('user.service.findAll', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
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
      return await this.userRepository.findOne({ _id: id });
    } catch (err) {
      this.logger.error('user.service.findOne', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
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
      return await this.userRepository.findOneAndUpdate(
        { _id: id },
        updateUserDto,
      );
    } catch (err) {
      this.logger.error('user.service.update', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
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
      return await this.userRepository.findOneAndUpdate(
        { _id: id },
        { deleted: true },
      );
    } catch (err) {
      this.logger.error('user.service.remove', err);
      if (err.status !== 500) {
        return {
          statusCode: err.status,
          ...err.response,
        };
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
