import { ObjectType } from '@nestjs/graphql';
import { Post } from '../post.model';
import { Paginated } from '../../../common/models/paginated.model';

@ObjectType()
export class PaginatedPosts extends Paginated(Post) {}
