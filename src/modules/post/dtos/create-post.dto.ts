import { InputType, Field } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class CreatePostDto {
    @Field()
    @IsString()
    title: string

    @Field()
    @IsString()
    body: string
}