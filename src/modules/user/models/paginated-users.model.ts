import { ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Paginated } from '../../../common/models/paginated.model';

@ObjectType()
export class PaginatedUsers extends Paginated(User) {}
