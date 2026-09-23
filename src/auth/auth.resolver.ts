import { Args, Context, Query, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service.js';
import { UserType } from '../users/type/user.type.js';
import { CreateUserDto } from '../users/dto/create.user.dto.js';
import { MessageType } from './type/message.type.js';
import { UseGuards } from '@nestjs/common';
import type { GraphQLContext } from './type/graphql-context.js';

import { GqlAuthGuard } from './gql-auth.guard.js';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  me(@Context() context: GraphQLContext) {
    return this.service.me(context.req.user!.sub);
  }

  @Mutation(() => UserType)
  async signUp(@Args('payload') payload: CreateUserDto) {
    return this.service.signUp(payload);
  }

  @Mutation(() => UserType)
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.service.signIn(email, password);
  }

  @Mutation(() => UserType)
  async googleSignIn(@Args('credential') credential: string) {
    return this.service.googleSignIn(credential);
  }

  @Mutation(() => MessageType)
  forgotPassword(@Args('email') email: string) {
    return this.service.forgotPassword(email);
  }

  @Mutation(() => Boolean)
  verifyResetCode(@Args('email') email: string, @Args('code') code: string) {
    return this.service.verifyResetCode(email, code);
  }

  @Mutation(() => MessageType)
  resetPassword(
    @Args('email') email: string,
    @Args('code') code: string,
    @Args('newPassword') newPassword: string,
  ) {
    return this.service.resetPassword(email, code, newPassword);
  }

  @Mutation(() => Boolean)
  logOut() {
    return this.service.logOut();
  }
}
