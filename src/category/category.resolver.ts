import { Args, Context, ID, Resolver, Query, Mutation } from '@nestjs/graphql';
import { CategoryType } from './type/category.type.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard.js';
import { CategoryService } from './category.service.js';

import type { GraphQLContext } from '../auth/type/graphql-context.js';
import { CategoryCreateDto } from './dto/create.category.dto.js';
import { CategoryUpdateDto } from './dto/update.category.dto.js';
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

  @Mutation(() => CategoryType)
  createCategory(
    @Context() context: GraphQLContext,
    @Args('financeSpaceId', { type: () => ID })
    financeSpaceId: string,
    @Args('input') input: CategoryCreateDto,
  ) {
    return this.service.create(context.req.user!.sub, financeSpaceId, input);
  }

  @Mutation(() => CategoryType)
  updateCategory(
    @Context() context: GraphQLContext,
    @Args('financeSpaceId', { type: () => ID })
    financeSpaceId: string,

    @Args('categoryId', { type: () => ID })
    categoryId: string,

    @Args('input') input: CategoryUpdateDto,
  ) {
    return this.service.update(
      context.req.user!.sub,
      financeSpaceId,
      categoryId,
      input,
    );
  }
}
