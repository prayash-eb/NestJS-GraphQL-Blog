import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}
