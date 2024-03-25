import { RbacRolesGuard } from './rbac.roles.guard';

describe('RbacRolesGuard', () => {
  it('should be defined', () => {
    expect(new RbacRolesGuard()).toBeDefined();
  });
});
