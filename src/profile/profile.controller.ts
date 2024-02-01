import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileDocument } from './entities/profile.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { UserDocument } from '../users/entities/user.entity';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async create(
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<ProfileDocument> {
    return await this.profileService.create(createProfileDto);
  }

  @Get()
  async findAll(): Promise<ProfileDocument[]> {
    return await this.profileService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async findOne(
    @Req() request: Request & { user: UserDocument },
  ): Promise<ProfileDocument> {
    const { user } = request;
    return await this.profileService.findOne(user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
