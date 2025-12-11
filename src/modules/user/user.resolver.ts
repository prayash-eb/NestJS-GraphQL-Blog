import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from '../../decorators/get-user';
import { Post } from '../post/post.model';
import { PostService } from '../post/post.service';
import { forwardRef, Inject } from '@nestjs/common';
import { PaginationArgs } from '../../common/dto/pagination.args';
import { PaginatedUsers } from './models/paginated-users.model';
import { PaginatedPosts } from '../post/models/paginated-posts.model';
import { PubSubService } from '../../common/services/pubsub.service';
import { SubscriptionEvent } from '../../common/enums/subscription-events.enum';
import { type IAccessTokenPayload } from '../auth/interface/token-payload';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
    private readonly pubSub: PubSubService,
  ) {}

  async createUser(@Args('userInput') createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return user.toObject();
  }

  @Mutation(() => User)
  async updateUser(
    @GetUser() user: IAccessTokenPayload,
    @Args('userInput') updateUserDto: UpdateUserDto,
  ) {
    const { id: userId } = user;
    return await this.userService.update(userId, updateUserDto);
  }

  @Query(() => PaginatedUsers)
  async users(
    @Args('pagination', { nullable: true }) pagination?: PaginationArgs,
  ): Promise<any> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    return await this.userService.findAll(page, limit);
  }

  @Query(() => User)
  async userById(@Args('userId') userId: string) {
    const user = await this.userService.findById(userId);
    return user.toJSON();
  }

  @Query(() => User)
  async userByEmail(@Args('email') email: string) {
    const user = await this.userService.findByEmail(email);
    return user?.toJSON();
  }

  @ResolveField(() => PaginatedPosts)
  async posts(
    @Parent() user: User,
    @Args('pagination', { nullable: true }) pagination?: PaginationArgs,
  ) {
    const { id: userId } = user;
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const sortBy = pagination?.sortBy || 'createdAt';
    const sortOrder = pagination?.sortOrder || 'desc';
    return await this.postService.findAllByUserId(
      userId,
      page,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Subscription(() => User, {
    name: 'userCreated',
    description: 'Subscribe to new users being created',
  })
  userCreated() {
    return this.pubSub.asyncIterator(SubscriptionEvent.USER_CREATED);
  }

  @Subscription(() => User, {
    name: 'userUpdated',
    description: 'Subscribe to users being updated',
  })
  userUpdated() {
    return this.pubSub.asyncIterator(SubscriptionEvent.USER_UPDATED);
  }
}
