import { InputType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { type FileUpload, GraphQLUpload } from "graphql-upload-ts";

@InputType()
export class CreatePostDto {
    @Field()
    @IsString()
    title: string

    @Field()
    @IsString()
    body: string

    @IsOptional()
    @Field(() => [GraphQLUpload], { nullable: true })
    media: FileUpload[]
}