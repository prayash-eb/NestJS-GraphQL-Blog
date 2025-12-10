import { Args, Mutation, Resolver, Query, ResolveField, Parent } from "@nestjs/graphql";
import { Post } from "./post.model";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PostService } from "./post.service";
import { GetUser } from "../../decorators/get-user";
import { UserService } from "../user/user.service";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { User } from "../user/models/user.model";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UseGuards } from "@nestjs/common";


@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly userService: UserService
    ) { }

    // @UseGuards(JwtAuthGuard)
    @Mutation(() => Post)
    async createPost(@GetUser() user: any, @Args("createPostInput") createPostDto: CreatePostDto) {
        return await this.postService.create(user.id, createPostDto)
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(() => Post)
    async updatePost(@GetUser() user: any, @Args("updatePostInput") updatePostDto: UpdatePostDto) {
        return await this.postService.update(user.id, updatePostDto)
    }

    @Query(() => [Post])
    async getPosts() {
        return await this.postService.findAll()
    }

    @Query(() => Post)
    async getPostById(@Args("postId") postId: string) {
        return await this.postService.findById(postId)
    }

    @ResolveField(() => User)
    async user(@Parent() post: Post) {
        const userId = post.user.toString()
        const user = (await this.userService.findById(userId)).toJSON()
        return {
            name: user.name,
            email: user.email,
            id: user._id
        }
    }
}