import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { UserModule } from '../user/user.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileUploadService } from './services/file-upload.service';
import { PubSubService } from '../../common/services/pubsub.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => UserModule),
  ],
  providers: [
    PostService,
    PostResolver,
    CloudinaryService,
    FileUploadService,
    PubSubService,
  ],
  exports: [PostService],
})
export class PostModule {}
