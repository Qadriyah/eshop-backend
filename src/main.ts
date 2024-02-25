import { NestFactory } from '@nestjs/core';
import {
  ForbiddenException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';

const whitelist = ['http://localhost:3000'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('/api');
  app.useLogger(app.get(LoggerService));
  await app.listen(configService.get('PORT'));
}
bootstrap();
