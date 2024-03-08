import { MessagesRepository } from './messages.repository';

describe('MessagesRepository', () => {
  it('should be defined', () => {
    expect(new MessagesRepository()).toBeDefined();
  });
});
