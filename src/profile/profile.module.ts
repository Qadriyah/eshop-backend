import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { UtilityService } from '../utility/utility.service';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';
import { ConfigModule } from '../config/config.module';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService,
    UtilityService,
    ProfileRepository,
    UserRepository,
  ],
  exports: [ProfileService, ProfileRepository],
  imports: [
    ConfigModule.register({ folder: './config' }),
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
