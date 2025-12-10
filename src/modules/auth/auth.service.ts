import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../user/dtos/create-user.dto";
import { UserService } from "../user/user.service";
import { LoginUserDto } from "../user/dtos/login-user.dto";
import { AuthResponse } from "./models/auth.model";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    private async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException("User not found")
        }
        const isPasswordMatched = await user.checkPassword(password);
        if (!isPasswordMatched) {
            throw new NotFoundException("User not found")
        }
        return user.toObject()
    }

    async signIn(loginUserInput: LoginUserDto): Promise<AuthResponse> {
        const { email, password } = loginUserInput;
        const user = await this.validateUser(email, password)
        const userPayload = {
            id: user._id.toHexString(),
            email: user.email
        }
        const accessToken = this.jwtService.sign(userPayload, {
            secret: this.configService.getOrThrow("JWT_SECRET")
        });
        const authResponse = {
            user: {
                id: user._id.toHexString(),
                name: user.name,
                email: user.email
            },
            accessToken
        }
        return authResponse
    }
    async signUp(createUserInput: CreateUserDto): Promise<AuthResponse> {
        const { email } = createUserInput;

        const userExist = await this.userService.findByEmail(email);
        if (userExist) {
            throw new ConflictException("User with same email already exists")
        }
        const user = await this.userService.create(createUserInput)
        if (!user) {
            throw new BadRequestException("Error while creating user")
        }
        const userPayload = {
            id: user._id.toHexString(),
            email: user.email
        }

        const accessToken = this.jwtService.sign(userPayload, {
            secret: this.configService.getOrThrow("JWT_SECRET"),
        })

        const authResponse = {
            user: {
                id: user._id.toHexString(),
                name: user.name,
                email: user.email
            },
            accessToken
        }

        return authResponse
    }
}