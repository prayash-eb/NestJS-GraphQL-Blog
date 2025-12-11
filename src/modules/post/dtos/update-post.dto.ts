
import { Field, InputType } from "@nestjs/graphql";
import { IsMongoId, IsString } from "class-validator";


@InputType()
export class UpdatePostDto {

    @Field()
    @IsMongoId()
    postId: string
    
    @Field()
    @IsString()
    title: string

    @Field()
    @IsString()
    body: string
}