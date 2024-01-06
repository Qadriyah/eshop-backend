import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as randtoken from 'rand-token';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      let newUser = await this.userRepository.findOne({
        email: createUserDto.email,
        deleted: false,
      });

      if (newUser) {
        throw new ForbiddenException({
          statusCode: 403,
          message: [
            {
              field: 'email',
              message: 'Email is already taken',
            },
          ],
        });
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const refreshToken = randtoken.uid(256);
      newUser = await this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        refreshToken,
      });
      return newUser;
    } catch (err) {
      this.logger.error('user.service.create', err);
      if (err.status === 403) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: 500,
        message: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
