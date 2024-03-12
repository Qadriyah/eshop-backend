import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { SalesRepository } from './sales.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from './entities/sale.entity';
import { UserRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { CommonService } from '@app/common';

@Module({
  controllers: [SalesController],
  providers: [
    SalesService,
    ConfigService,
    CommonService,
    SalesRepository,
    UserRepository,
  ],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Sale.name,
        useFactory: function () {
          const schema = SaleSchema;
          schema.virtual('totalAmount').get(function () {
            const totalAmount = this.lineItems?.reduce(
              (total, item) => (total += item.quantity * item.price),
              0,
            );
            return totalAmount;
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
export class SalesModule {}
