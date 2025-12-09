import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../user/user.model";

@ObjectType()
export class Post {

    @Field()
    title: string

    @Field()
    body: string

    @Field(() => User)
    user: any

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date
}