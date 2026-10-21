import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { TransactionType } from '../../generated/prisma/enums.js';

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id!: string;

  @Field()
  financeSpaceId: string;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => Float)
  amount!: number;

  @Field(() => String)
  category!: string;

  @Field(() => String, { nullable: true })
  comment!: string | null;

  @Field(() => Date)
  date!: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
