import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from '../sales/entities/sale.entity';
import { SalesRepository } from '../sales/sales.repository';
import { CommonService } from '@app/common';
import { User, UserSchema } from '../users/entities/user.entity';
import { UserRepository } from '../users/users.repository';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';

@Module({
  controllers: [ReportsController],
  providers: [
    ReportsService,
    CommonService,
    SalesRepository,
    UserRepository,
    CaslAbilityFactory,
  ],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Sale.name,
        useFactory: () => {
          const schema = SaleSchema;
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
export class ReportsModule {}
