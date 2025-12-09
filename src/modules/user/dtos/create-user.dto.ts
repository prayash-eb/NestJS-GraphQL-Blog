import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Field()
    @IsString()
    @Length(5, 30)
    password: string;
}