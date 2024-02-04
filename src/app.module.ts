import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CommonModule } from '@app/common';
import { LoggerModule } from './logger/logger.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URL: Joi.string().required(),
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        REDIRECT_URL: Joi.string().required(),
        NODE_ENV: Joi.string(),
        JWT_SECRET: Joi.string().required(),
        JWT_TTL: Joi.string().required(),
        JWT_TTL_SEC: Joi.number().required(),
        PORT: Joi.number().required(),
      }),
      // envFilePath: `./config/${process.env.NODE_ENV}.env`,
    }),
    CommonModule,
    UsersModule,
    LoggerModule,
    ProfileModule,
    AuthModule,
    ProductModule,
    SalesModule,
    CustomersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
