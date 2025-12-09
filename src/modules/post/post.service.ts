import { Injectable } from "@nestjs/common";
import { Post } from "./schema/post.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { toObjectId } from "../../utils/objectid";
import { CreatePostDto } from "./dtos/create-post.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) { }


    async create(userId: string, createPostDto: CreatePostDto) {
        const userObjectId = toObjectId(userId);
        return await this.postModel.create({
            userId: userObjectId,
            ...createPostDto
        })
    }

    async update(userId: string, updatePostDto: UpdatePostDto) {
        const userObjectId = toObjectId(userId);
        return await this.postModel.findByIdAndUpdate(userObjectId, {
            ...updatePostDto
        })
    }

    async findById(postId: string) {
        const postObjectId = toObjectId(postId)
        return await this.postModel.findById(postObjectId)
    }
    async findAll() {
        return await this.postModel.find({})
    }
    async findAllByUserId(userId: string) {
        const userObjectId = toObjectId(userId)
        return await this.postModel.find({
            userId: userObjectId
        })
    }
}