import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserResponse } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CreateUserValidationPipe,
  UpdateUserValidationPipe,
} from './users.pipe';
import { UserDocument } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { FilterQuery } from 'mongoose';
import { PaginateOptions, USER_TYPES } from '@app/common';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(CreateUserValidationPipe) data: CreateUserDto,
  ): Promise<UserResponse> {
    const user = await this.usersService.create(data);
    return {
      statusCode: 201,
      user: {
        id: user._id,
        email: user.email,
        refreshToken: user.refreshToken,
      } as UserDocument,
    };
  }

  @Get()
  async findAll(@Query() { user, page, limit }) {
    const query: FilterQuery<UserDocument> = {};
    const options: PaginateOptions = { page, limit };
    if (!page) options.page = 1;
    if (!limit) options.limit = 50;
    if (user) query.roles = USER_TYPES[user.toLocaleLowerCase()];

    const {
      docs: users,
      totalDocs: totalItems,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
    } = await this.usersService.findAll(query, options);
    return {
      statusCode: HttpStatus.OK,
      users,
      meta: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(UpdateUserValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been updated successfully',
      user,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been deleted successfully',
      user,
    };
  }
}
