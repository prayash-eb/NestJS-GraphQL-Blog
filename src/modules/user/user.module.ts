import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { UserSchema } from './schema/user.schema';
import { UserResolver } from './user.resolver';
import { PostModule } from '../post/post.module';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { PubSubService } from '../../common/services/pubsub.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => PostModule),
  ],
  providers: [UserService, UserResolver, PubSubService],
  exports: [UserService],
})
export class UserModule {}
