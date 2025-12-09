import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.model";
import { Model } from "mongoose";
import { toObjectId } from "../../utils/objectid";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";


export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(userInput: CreateUserDto) {
        return await this.userModel.create({
            ...userInput
        })
    }

    async update(userId: string, userInput: UpdateUserDto) {
        const userObjectId = toObjectId(userId);
        return await this.userModel.findByIdAndUpdate(userObjectId, {
            ...userInput
        })
    }

    async findAll() {
        return this.userModel.find({})
    }

    async findById(userId: string) {
        const userObjectId = toObjectId(userId)
        return await this.userModel.findById(userObjectId)
    }
    async findByEmail(email: string) {
        return await this.userModel.findOne({
            email
        })
    }

}