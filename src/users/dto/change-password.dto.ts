import { Field, InputType } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class ChangePasswordDto {
  @Field()
  currentPassword: string;

  @Field()
  @MinLength(8)
  newPassword: string;
}
