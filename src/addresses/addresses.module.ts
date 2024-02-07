import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { AddressRepository } from './address.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './entities/address.entity';
import { UserRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';
import { CommonService } from '@app/common';

@Module({
  controllers: [AddressesController],
  providers: [
    AddressesService,
    CommonService,
    AddressRepository,
    UserRepository,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: Address.name,
        schema: AddressSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class AddressesModule {}
