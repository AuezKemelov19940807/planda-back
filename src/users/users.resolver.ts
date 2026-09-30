import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { UsersService } from './users.service.js';
import { UserType } from './type/user.type.js';
import { UpdateUserDto } from './dto/update.user.dto.js';
import { GqlAuthGuard } from '../auth/gql-auth.guard.js';
import type { GraphQLContext } from '../auth/type/graphql-context.js';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto.js';
@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly service: UsersService) {}

  @Query(() => String)
  hello() {
    return 'Planda API works!';
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.service.create({
      email,
      password,
    });
  }

  @Query(() => UserType, { nullable: true })
  async getUser(@Args('email') email: string) {
    const user = await this.service.findOne(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      hasPassword: Boolean(user.password),
    };
  }

  @Mutation(() => UserType)
  async updateUser(@Args('payload') payload: UpdateUserDto) {
    return this.service.update(payload);
  }

  @Mutation(() => UserType)
  async removeUser(@Args('id') id: string) {
    return this.service.remove(id);
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @Args('payload') payload: ChangePasswordDto,
    @Context() context: GraphQLContext,
  ) {
    return this.service.changePassword(
      context.req.user!.sub,
      payload.currentPassword,
      payload.newPassword,
    );
  }

  @ResolveField(() => String, { nullable: true })
  avatar(@Parent() user: UserType) {
    if (!user.avatar) {
      return null;
    }

    if (
      user.avatar.startsWith('http://') ||
      user.avatar.startsWith('https://')
    ) {
      return user.avatar;
    }

    return `${process.env.API_URL}/api/files/${user.avatar}`;
  }
}
