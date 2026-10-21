import { Field, Float, ID, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionType } from '../../generated/prisma/enums.js';

@InputType()
export class CreateTransactionDto {
  @Field()
  @IsUUID()
  financeSpaceId!: string;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type!: TransactionType;

  @Field(() => Float)
  @IsNumber({
    allowNaN: true,
    allowInfinity: false,
  })
  @Min(0.01)
  amount!: number;

  @Field(() => ID)
  @IsUUID()
  categoryId!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string | null;

  @Field(() => Date, {
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}
