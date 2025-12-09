import { ObjectType, Field, HideField } from "@nestjs/graphql";

@ObjectType()
export class User {

    @Field()
    name: string

    @Field()
    email: string

    @HideField()
    password: string
}