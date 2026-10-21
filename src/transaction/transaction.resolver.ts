import { Args, Context, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service.js';
import type { GraphQLContext } from '../auth/type/graphql-context.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard.js';
import { Transaction } from './type/transaction.type.js';
import { CreateTransactionDto } from './dto/create.transaction.dto.js';
import { UpdateTransactionDto } from './dto/update.transaction.dto.js';
@Resolver(() => Transaction)
@UseGuards(GqlAuthGuard)
export class TransactionResolver {
  constructor(private readonly service: TransactionService) {}

  @Query(() => [Transaction])
  transactions(
    @Context() context: GraphQLContext,

    @Args('financeSpaceId', { type: () => ID })
    financeSpaceId: string,
  ) {
    return this.service.get(context.req.user!.sub, financeSpaceId);
  }

  @Mutation(() => Transaction)
  createTransaction(
    @Context() context: GraphQLContext,
    @Args('input') input: CreateTransactionDto,
  ) {
    return this.service.create(context.req.user!.sub, input);
  }

  
  @Mutation(() => Transaction)
  updateTransaction(
    @Context() context: GraphQLContext,
    @Args('id') id: string,
    @Args('input') input: UpdateTransactionDto,
  ) {
    return this.service.update(context.req.user!.sub, id, input);
  }

}
