import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PageInfo } from './page-info.model';

export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef])
    items: T[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
  }
  return PaginatedType;
}
