import * as winston from 'winston';
import { Injectable } from '@nestjs/common';
import config from '../config/config';

@Injectable()
export class LoggerService {
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

    if (config.NODE_ENV !== 'production') {
      logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      );
    }
    return logger;
  }

  log(message: string) {
    if (config.NODE_ENV !== 'test') {
      const logger = this.createLogger();
      logger.log({
        level: 'info',
        message,
      });
    }
  }

  error(functionName: string, error: any) {
    if (config.NODE_ENV !== 'test') {
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
    if (config.NODE_ENV !== 'test') {
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
