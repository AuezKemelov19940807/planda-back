import { Args, Context, ID, Resolver, Query } from '@nestjs/graphql';
import { CategoryType } from './type/category.type.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard.js';
import { CategoryService } from './category.service.js';

import type { GraphQLContext } from '../auth/type/graphql-context.js';
@Resolver(() => CategoryType)
@UseGuards(GqlAuthGuard)
export class CategoryResolver {
  constructor(private readonly service: CategoryService) {}

  @Query(() => [CategoryType])
  categories(
    @Context() context: GraphQLContext,

    @Args('financeSpaceId', { type: () => ID })
    financeSpaceId: string,
  ) {
    return this.service.get(context.req.user!.sub, financeSpaceId);
  }
}
