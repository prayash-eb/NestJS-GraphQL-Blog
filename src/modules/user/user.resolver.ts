import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUser } from '../../decorators/get-user';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Mutation(() => User)
    async createUser(@Args("userInput") createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto)
    }


    @Mutation(() => User)
    async updateUser(@GetUser("userId") userId: string, @Args("userInput") updateUserDto: UpdateUserDto) {

        return await this.userService.update(userId, updateUserDto)
    }

    @Query(() => [User])
    async users() {
        return await this.userService.findAll()
    }

    @Query(() => User)
    async userById(@Args("userId") userId: string) {
        return await this.userService.findById(userId)
    }

    @Query(() => User)
    async userByEmail(@Args("email") email: string) {
        return await this.userService.findByEmail(email)
    }
}
