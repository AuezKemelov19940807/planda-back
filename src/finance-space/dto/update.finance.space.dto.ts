import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateFinanceSpaceDto {


  

  @Field(() => String)
  @IsString()
  @MaxLength(50)
  name!: string;
}
