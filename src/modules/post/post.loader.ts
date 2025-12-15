import { InjectModel } from "@nestjs/mongoose";
import * as DataLoader from "dataloader";
import { Post } from "./schema/post.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PostLoader {

    constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) { }

    public readonly batchPosts = new DataLoader<string, Post[]>(
        async (userIds: string[]) => {
            const posts = await this.postModel.find({
                userId: {
                    $in: userIds
                }
            }).exec()

            const map = new Map<string, Post[]>();
            userIds.forEach((id) => map.set(id, []))
            posts.forEach((post) => map.get(post.userId.toString())?.push(post))

            // map the posts in the same order as userIds
            return userIds.map((id) => map.get(id))
        }
    )
}