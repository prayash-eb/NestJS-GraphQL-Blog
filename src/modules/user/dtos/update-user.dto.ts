import { InputType, PickType } from "@nestjs/graphql";
import { CreateUserDto } from "./create-user.dto";

@InputType()
export class UpdateUserDto extends PickType(CreateUserDto, ["email", "name"] as const) { }