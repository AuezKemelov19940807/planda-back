import { Module } from '@nestjs/common';
import { FinanceSpaceResolver } from './finance-space.resolver.js';
import { FinanceSpaceService } from './finance-space.service.js';

@Module({
  providers: [FinanceSpaceResolver, FinanceSpaceService],
  exports: [FinanceSpaceService],
})
export class FinanceSpaceModule {}
