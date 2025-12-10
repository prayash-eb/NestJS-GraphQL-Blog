import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

@InputType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 1, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, { defaultValue: 10, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
