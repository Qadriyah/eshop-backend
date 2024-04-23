import { NestFactory } from '@nestjs/core';
import {
  ForbiddenException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { ExpressAdapter } from '@nestjs/platform-express';

export const whitelistOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
];

async function bootstrap() {
  const adapter = new ExpressAdapter();
  adapter.set('trust proxy', 1);
  const app = await NestFactory.create(AppModule, adapter, {
    bufferLogs: true,
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelistOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('/server/api');
  app.useLogger(app.get(LoggerService));
  await app.listen(configService.get('PORT'));
}
bootstrap();
