import { ObjectType, Field, HideField } from "@nestjs/graphql";

@ObjectType()
export class User {

    @Field()
    id: string

    @Field()
    name: string

    @Field()
    email: string
}