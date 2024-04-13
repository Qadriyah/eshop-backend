import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, ProfileResponse } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserDocument } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/current.user.decorator';
import { CustomersService } from '../customers/customers.service';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly customerService: CustomersService,
  ) {}

  @Post()
  async create(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.create(createProfileDto);
    return {
      statusCode: HttpStatus.OK,
      profile,
    };
  }

  @Get()
  async findAll(): Promise<ProfileResponse> {
    const profiles = await this.profileService.findAll();
    return {
      statusCode: HttpStatus.OK,
      profiles,
    };
  }

  @Get('me')
  async findOne(@CurrentUser() user: UserDocument): Promise<ProfileResponse> {
    const profile = await this.profileService.findOne(user.id);
    return {
      statusCode: HttpStatus.OK,
      profile,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: UserDocument,
  ): Promise<ProfileResponse> {
    if (String(id) !== String(user.id)) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        errors: [
          {
            field: 'firstName',
            message: 'You are not allowed to perform this operation',
          },
        ],
      });
    }
    const profile = await this.profileService.update(id, updateProfileDto);
    await this.customerService.updateCustomer(profile.customer, {
      name: `${updateProfileDto.lastName} ${updateProfileDto.firstName}`,
      phone: updateProfileDto.phone,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Your details have been updated successfully',
      profile,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
