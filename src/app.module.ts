import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from './logger/logger.module';
import { UtilityModule } from './utility/utility.module';
import config from './config/config';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO_URL),
    UsersModule,
    LoggerModule,
    UtilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
