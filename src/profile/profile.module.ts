import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from '@app/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { ProfileRepository } from './profile.repository';
import { UserRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';
import { CustomersService } from '../customers/customers.service';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileService,
    ProfileRepository,
    UserRepository,
    CommonService,
    CustomersService,
  ],
  exports: [ProfileService, ProfileRepository],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Profile.name,
        useFactory: function () {
          const schema = ProfileSchema;
          schema.virtual('fullName').get(function () {
            return `${this.lastName || ''} ${this.firstName || ''}`;
          });
          return schema;
        },
      },
      {
        name: User.name,
        useFactory: function () {
          const schema = UserSchema;
          return schema;
        },
      },
    ]),
  ],
})
export class ProfileModule {}
