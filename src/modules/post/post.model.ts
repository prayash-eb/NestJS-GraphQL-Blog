import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../user/models/user.model";

@ObjectType()
export class Post {

    @Field()
    id: string

    @Field()
    title: string

    @Field()
    body: string

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date

    @Field()
    userId: string
}