import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileDocument } from './entities/profile.entity';

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

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProfileDocument> {
    return await this.profileService.findOne(id);
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
