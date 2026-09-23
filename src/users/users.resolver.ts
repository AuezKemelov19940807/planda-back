import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service.js';
import { UserType } from './type/user.type.js';
import { UpdateUserDto } from './dto/update.user.dto.js';

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
    return this.service.findOne(email);
  }

  @Mutation(() => UserType)
  async updateUser(@Args('payload') payload: UpdateUserDto) {
    return this.service.update(payload);
  }

  @Mutation(() => UserType)
  async removeUser(@Args('id') id: string) {
    return this.service.remove(id);
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
