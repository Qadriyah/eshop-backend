import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { Schema } from 'mongoose';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  user?: Schema.Types.ObjectId;
}
