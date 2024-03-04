import { SalesRepository } from './sales.repository';

describe('SalesRepository', () => {
  it('should be defined', () => {
    expect(new SalesRepository()).toBeDefined();
  });
});
