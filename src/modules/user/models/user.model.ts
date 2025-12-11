import { ObjectType, Field, HideField } from '@nestjs/graphql';
import { PaginatedPosts } from '../../post/models/paginated-posts.model';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => PaginatedPosts, { nullable: true })
  posts?: PaginatedPosts;
}
