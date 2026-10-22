import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsUUID,
  Matches,
  IsOptional,
} from 'class-validator';
import { TransactionType } from '../../generated/prisma/enums.js';
@InputType()
export class CategoryUpdateDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/, { message: 'Name must not be blank' })
  name!: string;
}
