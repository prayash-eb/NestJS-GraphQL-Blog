import { Injectable } from "@nestjs/common";
import { Post } from "./schema/post.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { toObjectId } from "../../utils/objectid";
import { CreatePostDto } from "./dtos/create-post.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { FileUploadService } from "./services/file-upload.service";
import { PubSubService } from "../../common/services/pubsub.service";
import { SubscriptionEvent } from "../../common/enums/subscription-events.enum";

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private readonly postModel: Model<Post>,
        private readonly fileUploadService: FileUploadService,
        private readonly pubSub: PubSubService
    ) { }

    async create(userId: string, createPostDto: CreatePostDto) {
        const userObjectId = toObjectId(userId);

        const mediaData = await this.fileUploadService.uploadMultipleFiles(
            createPostDto.media || []
        );

        const post = await this.postModel.create({
            userId: userObjectId,
            title: createPostDto.title,
            body: createPostDto.body,
            media: mediaData
        });

        const postJson = post.toJSON();

        // Publish subscription event
        await this.pubSub.publish(SubscriptionEvent.POST_CREATED, {
            postCreated: postJson
        });

        return postJson;
    }

    async update(userId: string, updatePostDto: UpdatePostDto) {
        const userObjectId = toObjectId(userId);
        const post = await this.postModel.findByIdAndUpdate(userObjectId, {
            ...updatePostDto
        }, { new: true });

        if (post) {
            const postJson = post.toJSON();
            // Publish subscription event
            await this.pubSub.publish(SubscriptionEvent.POST_UPDATED, {
                postUpdated: postJson
            });
            return postJson;
        }

        return post;
    }

    async findById(postId: string) {
        const postObjectId = toObjectId(postId)
        return await this.postModel.findById(postObjectId)
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [items, totalItems] = await Promise.all([
            this.postModel.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }),
            this.postModel.countDocuments({})
        ]);

        return {
            items,
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

    async findAllByUserId(userId: string, page: number = 1, limit: number = 10) {
        const userObjectId = toObjectId(userId);
        const skip = (page - 1) * limit;
        const [items, totalItems] = await Promise.all([
            this.postModel.find({ userId: userObjectId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            this.postModel.countDocuments({ userId: userObjectId })
        ]);

        return {
            items,
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
}