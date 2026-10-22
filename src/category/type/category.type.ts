import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TransactionType } from '../../generated/prisma/enums.js';

@ObjectType()
export class CategoryType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  financeSpaceId: string;

  @Field()
  name: string;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
