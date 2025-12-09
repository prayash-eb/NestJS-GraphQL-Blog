import { Args, Mutation, Resolver, Query, ResolveField, Parent } from "@nestjs/graphql";
import { Post } from "./post.model";
import { CreatePostDto } from "./dtos/create-post.dto";
import { PostService } from "./post.service";
import { GetUser } from "../../decorators/get-user";
import { User } from "../user/schema/user.schema";
import { UserService } from "../user/user.service";
import { UpdatePostDto } from "./dtos/update-post.dto";


@Resolver(() => Post)
export class PostResolver {

    constructor(
        private readonly postService: PostService,
        private readonly userService: UserService
    ) { }

    @Mutation(() => Post)
    async createPost(@GetUser("uid") userId: string, @Args("createPostInput") createPostDto: CreatePostDto) {
        console.log(userId, createPostDto);
        return await this.postService.create(userId, createPostDto)
    }

    @Mutation(() => Post)
    async updatePost(@GetUser("uid") userId: string, @Args("updatePostInput") updatePostDto: UpdatePostDto) {
        return await this.postService.update(userId, updatePostDto)
    }
    @Query(() => [Post])
    async getPosts() {
        return await this.postService.findAll()
    }

    @Query(() => Post)
    async getPostById(@Args("postId") postId: string) {
        return await this.postService.findById(postId)
    }

    // @ResolveField(() => User)
    // async getAuthor(@Parent() post: Post){
    //     const userId = String(post.user)
    //     return await this.userService.findById(userId)
    // }
}