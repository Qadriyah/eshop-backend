import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileDocument } from './entities/profile.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UserDocument } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/current.user.decorator';

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
  async findOne(@CurrentUser() user: UserDocument): Promise<ProfileDocument> {
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
