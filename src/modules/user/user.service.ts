import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { toObjectId } from "../../utils/objectid";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDocument } from "./schema/user.schema";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PubSubService } from "../../common/services/pubsub.service";
import { SubscriptionEvent } from "../../common/enums/subscription-events.enum";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly pubSub: PubSubService
    ) { }

    async create(userInput: CreateUserDto): Promise<UserDocument> {
      
        const user = await this.userModel.create({
            ...userInput
        })
        if (!user) {
            throw new BadRequestException("Error while creating user")
        }

        // Publish subscription event
        const userJson = user.toJSON();
        await this.pubSub.publish(SubscriptionEvent.USER_CREATED, {
            userCreated: userJson
        });

        return user
    }

    async update(userId: string, userInput: UpdateUserDto): Promise<User> {
        const userObjectId = toObjectId(userId);
        const user = await this.userModel.findByIdAndUpdate(userObjectId, {
            ...userInput
        }, { new: true })
        if (!user) {
            throw new NotFoundException("User not found")
        }

        // Publish subscription event
        const userJson = user.toJSON();
        await this.pubSub.publish(SubscriptionEvent.USER_UPDATED, {
            userUpdated: userJson
        });

        return user?.toObject()
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [items, totalItems] = await Promise.all([
            this.userModel.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }),
            this.userModel.countDocuments({})
        ]);

        return {
            items: items.map((user) => user.toJSON()),
            pageInfo: {
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page * limit < totalItems,
                hasPreviousPage: page > 1
            }
        };
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