import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../user/dtos/create-user.dto";
import { UserService } from "../user/user.service";


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly userService: UserService) { }

    validateUser() {

    }

    signIn() {

    }

    async signUp(createUserInput: CreateUserDto) {
        const user = await this.userService.create(createUserInput)
        if (!user) {
            throw new BadRequestException("Error while creating user")
        }
        const userPayload = {
            id: user._id.toHexString(),
            email: user.email
        }
        const accessToken = this.jwtService.sign(userPayload)

        return {
            user, accessToken
        }
    }
}