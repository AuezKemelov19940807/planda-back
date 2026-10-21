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
import { TransactionType } from '../../generated/prisma/enums.js';
import { Type } from 'class-transformer';
@InputType()
export class UpdateTransactionDto {
  @Field(() => TransactionType, { nullable: true })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @Field(() => Float, { nullable: true })
  @IsNumber({
    allowNaN: true,
    allowInfinity: false,
  })
  @IsOptional()
  @Min(0.01)
  amount?: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @Field(() => Date, {
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}
