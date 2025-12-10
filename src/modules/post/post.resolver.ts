import { Args, Mutation, Resolver, Query, ResolveField, Parent, Subscription } from "@nestjs/graphql";
import { Post } from "./post.model";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PostService } from "./post.service";
import { GetUser } from "../../decorators/get-user";
import { UserService } from "../user/user.service";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { User } from "../user/models/user.model";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UseGuards } from "@nestjs/common";
import { PaginationArgs } from "../../common/dto/pagination.args";
import { PaginatedPosts } from "./models/paginated-posts.model";
import { PubSubService } from "../../common/services/pubsub.service";
import { SubscriptionEvent } from "../../common/enums/subscription-events.enum";

@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly userService: UserService,
        private readonly pubSub: PubSubService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Post)
    async createPost(@GetUser() user: any, @Args("createPostInput") createPostDto: CreatePostDto) {
        return await this.postService.create(user.id, createPostDto)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Post)
    async updatePost(@GetUser() user: any, @Args("updatePostInput") updatePostDto: UpdatePostDto) {
        return await this.postService.update(user.id, updatePostDto)
    }

    @Query(() => PaginatedPosts)
    async getPosts(@Args('pagination', { nullable: true }) pagination?: PaginationArgs) {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 10;
        return await this.postService.findAll(page, limit);
    }

    @Query(() => Post)
    async getPostById(@Args("postId") postId: string) {
        return await this.postService.findById(postId)
    }

    @ResolveField(() => User)
    async user(@Parent() post: Post) {
        const { userId } = post;
        return (await this.userService.findById(userId)).toJSON()
    }

    @Subscription(() => Post, {
        name: 'postCreated',
        description: 'Subscribe to new posts being created'
    })
    postCreated() {
        return this.pubSub.asyncIterator(SubscriptionEvent.POST_CREATED);
    }

    @Subscription(() => Post, {
        name: 'postUpdated',
        description: 'Subscribe to posts being updated'
    })
    postUpdated() {
        return this.pubSub.asyncIterator(SubscriptionEvent.POST_UPDATED);
    }
}