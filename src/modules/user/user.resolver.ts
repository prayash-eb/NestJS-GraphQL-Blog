import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './models/user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from '../../decorators/get-user';
import { Post } from '../post/post.model';
import { PostService } from '../post/post.service';
import { forwardRef, Inject } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        @Inject(forwardRef(() => PostService)) private postService: PostService
    ) { }

    async createUser(@Args("userInput") createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto)
        return user.toObject()
    }

    @Mutation(() => User)
    async updateUser(@GetUser("userId") userId: string, @Args("userInput") updateUserDto: UpdateUserDto) {
        return await this.userService.update(userId, updateUserDto)
    }

    @Query(() => [User])
    async users() {
        const users = await this.userService.findAll()
        return users
    }

    @Query(() => User)
    async userById(@Args("userId") userId: string) {
        const user = await this.userService.findById(userId)
        return user.toJSON()
    }

    @Query(() => User)
    async userByEmail(@Args("email") email: string) {
        const user = await this.userService.findByEmail(email)
        return user?.toJSON()
    }

    @ResolveField(() => [Post])
    async posts(@Parent() user: User) {
        const { id: userId } = user;
        const posts = await this.postService.findAllByUserId(userId)
        return posts
    }
}
