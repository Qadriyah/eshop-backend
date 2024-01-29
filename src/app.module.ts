import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import 'dotenv/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';
import { UtilityModule } from './utility/utility.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    UsersModule,
    LoggerModule,
    UtilityModule,
    ProfileModule,
    ConfigModule.register({ folder: './config' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
