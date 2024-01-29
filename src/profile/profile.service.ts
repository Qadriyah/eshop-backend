import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from '../users/users.repository';
import { ProfileDocument } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createProfileDto: CreateProfileDto): Promise<ProfileDocument> {
    try {
      const user = await this.userRepository.findOne({
        _id: createProfileDto.user,
      });
      if (!user) {
        throw new ForbiddenException({
          statusCode: HttpStatus.NOT_FOUND,
          message: [
            {
              field: 'user',
              message: 'User not found',
            },
          ],
        });
      }

      return await this.profileRepository.create(createProfileDto);
    } catch (err) {
      this.logger.error('profile.service.create', err);
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
            field: 'firstName',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async findAll(): Promise<ProfileDocument[]> {
    return [];
  }

  async findOne(id: string): Promise<ProfileDocument> {
    try {
      return (await this.profileRepository.findOne({ user: id })).populate([
        {
          path: 'user',
          select: 'email avator',
        },
      ]);
    } catch (err) {
      this.logger.error('profile.service.findOne', err);
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
            field: 'firstName',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
