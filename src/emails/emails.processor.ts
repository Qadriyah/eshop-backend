import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { mailOptionsProps } from './emails.service';
import { Logger } from '@nestjs/common';
import { EmailsSendgrid } from './emails.sendgrid';
import { MailDataRequired } from '@sendgrid/mail';

@Processor('email')
export class EmailsProcessor {
  private readonly logger = new Logger(EmailsProcessor.name);

  constructor(
    private readonly sgClient: EmailsSendgrid,
    @InjectQueue('email') private readonly emailQueue: Queue,
  ) {}

  @Process()
  async sendEmail(job: Job<MailDataRequired>) {
    const sent = await this.sgClient.sendEmail(job.data);
    if (!sent) {
      throw new Error('Email sending failed');
    }
  }

  @OnQueueActive()
  onActive(job: Job<mailOptionsProps>) {
    this.logger.log(`Starting job ${job.id} : ${job.data.from}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job<mailOptionsProps>) {
    this.logger.log(`Job ${job.id} has been completed`);
  }

  @OnQueueFailed()
  onFailed(job: Job<mailOptionsProps>, err: Error) {
    this.logger.error(`Job ${job.id} has failed with error : ${err}`);
  }
}
