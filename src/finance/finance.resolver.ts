import { Resolver, Query, Context } from '@nestjs/graphql';
import { FinanceService } from './finance.service.js';

@Resolver()
export class FinanceResolver {
  constructor(private readonly financeService: FinanceService) {}
}
