import { Controller, Post, UseGuards } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Post()
  async create() {
    const email = await this.emailsService.create({
      from: 'bakers@cognativeinsights.com',
      to: 'b.zawad@yahoo.com',
      fromName: 'Support',
      subject: 'Inquiry',
      template: 'contact_us',
      body: '',
    });
    return email;
  }
}
