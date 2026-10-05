import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FinanceSpace {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  isDefault: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
