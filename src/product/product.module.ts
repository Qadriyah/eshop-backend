import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { UtilityService } from '../utility/utility.service';
import { Product, ProductSchema } from './entities/product.entity';
import { ConfigModule } from '../config/config.module';
import { User, UserSchema } from '../users/entities/user.entity';
import { UserRepository } from '../users/users.repository';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    UtilityService,
    UserRepository,
    ProductRepository,
  ],
  imports: [
    ConfigModule.register({ folder: './config' }),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class ProductModule {}
