import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { toObjectId } from "../../utils/objectid";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDocument } from "./schema/user.schema";
import { BadRequestException, NotFoundException } from "@nestjs/common";


export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(userInput: CreateUserDto): Promise<UserDocument> {
      
        const user = await this.userModel.create({
            ...userInput
        })
        if (!user) {
            throw new BadRequestException("Error while creating user")
        }
        return user
    }

    async update(userId: string, userInput: UpdateUserDto): Promise<User> {
        const userObjectId = toObjectId(userId);
        const user = await this.userModel.findByIdAndUpdate(userObjectId, {
            ...userInput
        })
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user?.toObject()
    }

    async findAll(): Promise<User[] | []> {
        return (await this.userModel.find({})).map((user) => user.toJSON())
    }

    async findById(userId: string): Promise<UserDocument> {
        const userObjectId = toObjectId(userId)
        const user = await this.userModel.findById(userObjectId)
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({
            email
        })
        return user
    }
}