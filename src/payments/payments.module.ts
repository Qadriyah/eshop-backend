import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonService } from '@app/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ProductRepository } from '../product/product.repository';
import { Product, ProductSchema } from '../product/entities/product.entity';
import { UsersModule } from '../users/users.module';
import { SalesService } from '../sales/sales.service';
import { SalesRepository } from '../sales/sales.repository';
import { Sale, SaleSchema } from '../sales/entities/sale.entity';
import { PaymentsCustomerService } from './payments.customer.service';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    CommonService,
    SalesService,
    PaymentsCustomerService,
    SalesRepository,
    ProductRepository,
  ],
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Sale.name,
        schema: SaleSchema,
      },
    ]),
  ],
})
export class PaymentsModule {}
