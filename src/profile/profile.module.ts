import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from '@app/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, UserRepository, CommonService],
  exports: [ProfileService, ProfileRepository],
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class ProfileModule {}
