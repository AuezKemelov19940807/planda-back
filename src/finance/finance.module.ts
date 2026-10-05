import { Module } from '@nestjs/common';
import { FinanceResolver } from './finance.resolver.js';
import { FinanceService } from './finance.service.js';

@Module({
  providers: [FinanceResolver, FinanceService],
})
export class FinanceModule {}
