import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthType {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string | null;

  @Field({ nullable: true })
  googleId?: string | null;

  @Field({ nullable: true })
  name?: string | null;

  @Field({ nullable: true })
  avatar?: string | null;

  @Field()
  access_token: string;

  @Field(() => Boolean)
  hasPassword: boolean;

  @Field(() => Boolean)
  isGoogleAccount: boolean;
}
