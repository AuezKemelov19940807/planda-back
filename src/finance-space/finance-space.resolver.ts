import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FinanceSpaceService } from './finance-space.service.js';
import { FinanceSpace } from './type/finance-space.type.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard.js';
import type { GraphQLContext } from '../auth/type/graphql-context.js';
import { CreateFinanceSpaceDto } from './dto/create.finance.space.dto.js';
import { UpdateFinanceSpaceDto } from './dto/update.finance.space.dto.js';

@Resolver(() => FinanceSpace)
@UseGuards(GqlAuthGuard)
export class FinanceSpaceResolver {
  constructor(private readonly service: FinanceSpaceService) {}

  @Query(() => [FinanceSpace])
  financeSpaces(@Context() context: GraphQLContext) {
    return this.service.get(context.req.user!.sub);
  }

  @Mutation(() => FinanceSpace)
  createFinanceSpace(
    @Context() context: GraphQLContext,
    @Args('input') input: CreateFinanceSpaceDto,
  ) {
    return this.service.create(context.req.user!.sub, input.name);
  }

  @Mutation(() => FinanceSpace)
  updateFinanceSpace(
    @Context() context: GraphQLContext,
    @Args('id') id: string,
    @Args('input') input: UpdateFinanceSpaceDto,
  ) {
    return this.service.update(context.req.user!.sub, id, input.name);
  }

  @Mutation(() => Boolean)
  deleteFinanceSpace(
    @Context() context: GraphQLContext,
    @Args('id') id: string,
  ) {
    return this.service.delete(context.req.user!.sub, id);
  }
}
