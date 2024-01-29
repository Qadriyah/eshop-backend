import * as winston from 'winston';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable()
export class LoggerService {
  constructor(private readonly configService: ConfigService) {}

  private createLogger() {
    const logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
      ),
      transports: [],
    });

    if (this.configService.get('NODE_ENV') !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      );
    }
    return logger;
  }

  log(message: string) {
    if (this.configService.get('NODE_ENV') !== 'test') {
      const logger = this.createLogger();
      logger.log({
        level: 'info',
        message,
      });
    }
  }

  error(functionName: string, error: any) {
    if (this.configService.get('NODE_ENV') !== 'test') {
      const logger = this.createLogger();
      error = error instanceof Error ? error.message : error;
      logger.log({
        level: 'error',
        message: JSON.stringify({
          error,
          functionName,
        }).replace(/"/g, ' '),
      });
    }
  }

  warn(functionName: string, error: any) {
    if (this.configService.get('NODE_ENV') !== 'test') {
      const logger = this.createLogger();
      error = error instanceof Error ? error.message : error;
      logger.log({
        level: 'warn',
        message: JSON.stringify({
          error,
          functionName,
        }).replace(/"/g, ' '),
      });
    }
  }
}
