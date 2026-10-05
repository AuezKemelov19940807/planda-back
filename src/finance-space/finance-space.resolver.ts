import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';

import { FinanceSpaceService } from './finance-space.service.js';
import { FinanceSpace } from './type/finance-space.type.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard.js';
// import type { GraphQLContext } from './type/graphql-context.js';
import type { GraphQLContext } from '../auth/type/graphql-context.js';
import { CreateFinanceSpaceDto } from './dto/create.finance.space.dto.js';
@Resolver(() => FinanceSpace)
export class FinanceSpaceResolver {
  constructor(private readonly financeSpaceService: FinanceSpaceService) {}

  @Query(() => [FinanceSpace])
  @UseGuards(GqlAuthGuard)
  financeSpaces(@Context() context: GraphQLContext) {
    return this.financeSpaceService.getSpaces(context.req.user!.sub);
  }

  @Mutation(() => FinanceSpace)
  @UseGuards(GqlAuthGuard)
  createFinanceSpace(
    @Context() context: GraphQLContext,
    @Args('input') input: CreateFinanceSpaceDto,
  ) {
    return this.financeSpaceService.createSpace(
      context.req.user!.sub,
      input.name,
    );
  }
}
