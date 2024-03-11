import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailsSendgrid {
  private readonly logger = new Logger(EmailsSendgrid.name);

  constructor(configService: ConfigService) {
    sgMail.setApiKey(configService.get('SENDGRID_API_KEY'));
  }

  async sendEmail(email: sgMail.MailDataRequired): Promise<boolean> {
    try {
      await sgMail.send(email);
      return true;
    } catch (err) {
      this.logger.error('emails.sendgrid.sendEmail', err);
      return false;
    }
  }
}
