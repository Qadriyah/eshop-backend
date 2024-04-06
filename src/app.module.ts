import 'dotenv/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as Joi from 'joi';
import { CommonModule } from '@app/common';
import { LoggerModule } from './logger/logger.module';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { SalesModule } from './sales/sales.module';
import { CustomersModule } from './customers/customers.module';
import { AddressesModule } from './addresses/addresses.module';
import { PaymentsModule } from './payments/payments.module';
import { MessagesModule } from './messages/messages.module';
import { EmailsModule } from './emails/emails.module';
import { FilesModule } from './files/files.module';
import { ReportsModule } from './reports/reports.module';
import { CaslModule } from './casl/casl.module';
import { RbacModule } from './rbac/rbac.module';

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
        JWT_TTL: Joi.number().required(),
        PORT: Joi.number().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
        BASE_URL: Joi.string().required(),
        REDIRECT_FRONTEND_URL: Joi.string().required(),
        STRIPE_WEBHOOK_TOKEN: Joi.string().required(),
        SENDGRID_API_KEY: Joi.string().required(),
        EMAIL_SENDER: Joi.string().required(),
      }),
      // envFilePath: `./config/${process.env.NODE_ENV}.env`,
    }),
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: memoryStorage(),
      }),
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
        attempts: 3,
      },
    }),
    CommonModule,
    UsersModule,
    LoggerModule,
    ProfileModule,
    AuthModule,
    ProductModule,
    SalesModule,
    CustomersModule,
    AddressesModule,
    PaymentsModule,
    MessagesModule,
    EmailsModule,
    FilesModule,
    ReportsModule,
    CaslModule,
    RbacModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
