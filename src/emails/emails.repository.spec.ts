import { EmailsRepository } from './emails.repository';

describe('EmailsRepository', () => {
  it('should be defined', () => {
    expect(new EmailsRepository()).toBeDefined();
  });
});
