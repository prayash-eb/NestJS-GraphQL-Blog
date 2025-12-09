import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dtos/create-user.dto";
import { LoginUserDto } from "../user/dtos/login-user.dto";
import { User } from "../user/user.model";


@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) { }

    @Mutation(()=>User)
    async signUpUser(@Args("createUserInput") createUserInput: CreateUserDto) {
        return await this.authService.signUp(createUserInput)
    }

    @Mutation(()=>User)
    signInUser(@Args("loginUserInput") loginUserInput: LoginUserDto) {

    }
}