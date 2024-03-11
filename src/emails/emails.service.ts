import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import Handlebars from 'handlebars';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface mailOptionsProps {
  from: string;
  fromName: string;
  to: string;
  subject: string;
  template: string;
  body?: any;
}

Handlebars.registerHelper(
  'fullName',
  function (firstName: string, lastName: string) {
    return `${lastName} ${firstName}`;
  },
);

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async create(mailOptions: mailOptionsProps): Promise<Error | any> {
    try {
      const emailBody = await this.getEmailBody({}, mailOptions.template);
      await this.emailQueue.add({
        to: mailOptions.to,
        from: {
          name: mailOptions.fromName,
          email: mailOptions.from,
        },
        subject: mailOptions.subject,
        html: emailBody,
      });
      return emailBody;
    } catch (err) {
      this.logger.error('emails.service.create', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }

  async getEmailBody(ctx: any, templateName: string): Promise<any> {
    try {
      const source = await fs.readFile(
        path.resolve(
          process.cwd(),
          'src/emails/templates',
          `${templateName}.hbs`,
        ),
        { encoding: 'utf8', flag: 'r' },
      );

      const template = Handlebars.compile(source);
      const emailBody = template(ctx);
      return emailBody;
    } catch (err) {
      this.logger.error('emails.service.getEmailBody', err);
      if (err.status !== 500) {
        throw err;
      }
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: [
          {
            field: 'email',
            message: 'Something went wrong',
          },
        ],
      });
    }
  }
}
