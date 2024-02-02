import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserRepository } from './users.repository';
import { ProfileModule } from '../profile/profile.module';
import { CommonService } from '@app/common';

@Module({
  controllers: [UsersController],
  providers: [UsersService, CommonService, UserRepository],
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
