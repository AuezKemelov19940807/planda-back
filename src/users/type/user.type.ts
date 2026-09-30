import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  password: string;

  @Field()
  access_token: string;

  @Field(() => Boolean)
  hasPassword: boolean;
}
