import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsOptional,
  IsUUID,
} from 'class-validator';

@InputType()
export class CategoryUpdateDto {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/, { message: 'Name must not be blank' })
  name!: string;
}
