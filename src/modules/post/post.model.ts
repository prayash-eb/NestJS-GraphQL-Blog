import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Media {
    @Field()
    type: string;
    @Field()
    link: string;
    @Field()
    publicId: string
}


@ObjectType()
export class Post {

    @Field()
    id: string

    @Field()
    title: string

    @Field()
    body: string

    @Field()
    media: Media

    @Field()
    createdAt: Date

    @Field()
    updatedAt: Date

    @Field()
    userId: string
}