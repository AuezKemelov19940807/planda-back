import { Module } from '@nestjs/common';
import { FinanceResolver } from './finance.resolver.js';

@Module({
  providers: [FinanceResolver]
})
export class FinanceModule {}
