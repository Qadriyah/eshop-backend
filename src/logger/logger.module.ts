import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigModule } from '../config/config.module';

@Module({
  providers: [LoggerService],
  imports: [ConfigModule.register({ folder: './config' })],
})
export class LoggerModule {}
