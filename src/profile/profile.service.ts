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
          errors: [
            {
              field: 'user',
              message: 'User not found',
            },
          ],
        });
      }

      return this.profileRepository.create({
        ...createProfileDto,
      } as unknown as ProfileDocument);
    } catch (err) {
      this.logger.error('profile.service.create', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
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
      const profile = await this.profileRepository
        .findOne({ user: id })
        ?.populate([
          {
            path: 'user',
            select: 'email avator roles',
          },
        ]);
      return profile;
    } catch (err) {
      this.logger.error('profile.service.findOne', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'firstName',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileDocument> {
    try {
      let profile = await this.profileRepository.findOne({ user: userId });
      if (!profile) {
        profile = await this.profileRepository.create(
          updateProfileDto as unknown as ProfileDocument,
        );
      } else {
        profile = await this.profileRepository
          .findOneAndUpdate({ _id: profile.id }, updateProfileDto)
          .populate([
            {
              path: 'user',
              select: 'email roles avator',
            },
          ]);
      }

      return profile;
    } catch (err) {
      this.logger.error('profile.service.update', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'firstName',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
