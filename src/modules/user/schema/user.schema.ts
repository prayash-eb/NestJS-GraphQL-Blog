import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    timestamps: true, toJSON: {
        transform: (doc: any, ret: any) => {
            delete ret.__v;
            delete ret.password
            return ret
        }
    }
})
export class User extends Document {

    @Prop({ type: String })
    name: string

    @Prop({ type: String, unique: true })
    email: string

    @Prop({ type: String })
    password: string
}


export const UserSchema = SchemaFactory.createForClass(User)