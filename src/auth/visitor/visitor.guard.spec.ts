import { AuthVisitorGuard } from './visitor.guard';

describe('AuthVisitorGuard', () => {
  it('should be defined', () => {
    expect(new AuthVisitorGuard()).toBeDefined();
  });
});
