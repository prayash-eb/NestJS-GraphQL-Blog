import { ObjectType, Field, HideField } from "@nestjs/graphql";
import { Post } from "../../post/post.model";

@ObjectType()
export class User {

    @Field()
    id: string

    @Field()
    name: string

    @Field()
    email: string

    @Field(() => [Post], { nullable: true })
    posts?: Post[]
}