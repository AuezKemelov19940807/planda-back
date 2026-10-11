import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service.js';
import { TransactionResolver } from './transaction.resolver.js';

@Module({
  providers: [TransactionService, TransactionResolver]
})
export class TransactionModule {}
