import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        forwardRef(() => UserModule)
    ],
    providers: [PostService, PostResolver],
    exports: [PostService]
})
export class PostModule { }
