import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsUUID,
  Matches,
} from 'class-validator';
import { TransactionType } from '../../generated/prisma/enums.js';
@InputType()
export class CategoryCreateDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/, { message: 'Name must not be blank' })
  name!: string;

  @Field(() => ID)
  @IsUUID()
  financeSpaceId!: string;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type!: TransactionType;
}
