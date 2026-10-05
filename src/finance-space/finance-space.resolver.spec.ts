import { Test, TestingModule } from '@nestjs/testing';
import { FinanceSpaceResolver } from './finance-space.resolver.js';

describe('FinanceSpaceResolver', () => {
  let resolver: FinanceSpaceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinanceSpaceResolver],
    }).compile();

    resolver = module.get<FinanceSpaceResolver>(FinanceSpaceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
