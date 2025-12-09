import { Document, Types } from "mongoose";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: Types.ObjectId, ref: "User" })
    user: Types.ObjectId

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, required: true })
    body: string;
}

export const PostSchema = SchemaFactory.createForClass(Post)