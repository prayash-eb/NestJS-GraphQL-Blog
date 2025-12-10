import { Types } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema({
    timestamps: true, toJSON: {
        transform: (doc: any, ret: any) => {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})
export class Post {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    userId: Types.ObjectId

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    body: string;
}

export const PostSchema = SchemaFactory.createForClass(Post)