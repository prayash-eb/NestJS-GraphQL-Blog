import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { AuthResponse } from './models/auth.model';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signUpUser(@Args('createUserInput') createUserInput: CreateUserDto) {
    return await this.authService.signUp(createUserInput);
  }

  @Mutation(() => AuthResponse)
  async signInUser(@Args('loginUserInput') loginUserInput: LoginUserDto) {
    return await this.authService.signIn(loginUserInput);
  }
}
