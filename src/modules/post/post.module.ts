import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { UserModule } from '../user/user.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), UserModule],
    providers: [PostService, PostResolver],
})
export class PostModule { }
