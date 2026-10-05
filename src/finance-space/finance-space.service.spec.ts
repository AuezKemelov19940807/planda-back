import { Test, TestingModule } from '@nestjs/testing';
import { FinanceSpaceService } from './finance-space.service.js';

describe('FinanceSpaceService', () => {
  let service: FinanceSpaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinanceSpaceService],
    }).compile();

    service = module.get<FinanceSpaceService>(FinanceSpaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
