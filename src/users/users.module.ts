import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { UtilityService } from '../utility/utility.service';
import { ProfileModule } from '../profile/profile.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UtilityService],
  exports: [UserRepository],
  imports: [
    ProfileModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class UsersModule {}
