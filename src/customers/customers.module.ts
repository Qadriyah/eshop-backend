import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { UserRepository } from '../users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { CommonService } from '@app/common';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, CommonService, UserRepository],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: function () {
          return UserSchema;
        },
      },
    ]),
  ],
})
export class CustomersModule {}
